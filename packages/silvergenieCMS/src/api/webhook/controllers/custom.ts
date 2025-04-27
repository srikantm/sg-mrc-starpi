import { responseService } from "../../../utils";
//@ts-ignore
import { validateWebhookSignature } from "razorpay";

export default {
  webhook: async (ctx, next) => {
    try {
      const secret = process.env.WEBHOOK_SECRET;

      const valid = validateWebhookSignature(
        JSON.stringify(ctx.request.body),
        ctx.headers["x-razorpay-signature"],
        secret
      );

      if (valid) {
        const event = ctx.request.body.event;
        const payload = ctx.request.body.payload;

        switch (event) {
          case "subscription.completed":
          case "subscription.cancelled":
          case "subscription.pending":
          case "subscription.halted":
          case "subscription.paused":
            console.log("event : ", event, " called");
            await updateRazorpaySubscription(ctx, payload);
            console.log("subscription updated successfully for : ", event);
            break;
          case "subscription.authenticated":
            console.log("subscription.authenticated event called!");
            return;
          case "subscription.charged":
            await handleSubscriptionEventCharged(ctx, payload);
            break;
          case "subscription.updated":
            console.log("subscription.updated event called!");
            return;
          case "order.paid":
            await handleOrderPaidEvent(ctx, payload);
            break;
          default:
            console.log(`Unhandled event: ${event}`);
        }

        return new responseService(ctx).OK({});
      } else {
        console.log("Invalid signature");
        return new responseService(
          ctx,
          "Your signature is not valid",
          "INVALID_SIGNATURE"
        ).BAD_REQUEST;
      }
    } catch (err) {
      console.error("Internal server error", err);
      ctx.body = err;
      return ctx.internalServerError("error", err);
    }
  },
};

const handleSubscriptionEventCharged = async (ctx: any, payload: any) => {
  const subscriptionId = payload.subscription.entity.id;

  const subsciptionTrackers = await strapi.entityService.findMany(
    "api::subscription-tracker.subscription-tracker",
    {
      filters: {
        razorpay_subscription: { subscriptionId: { $eq: subscriptionId } },
      },
      sort: "createdAt:desc",
      populate: {
        family: { fields: ["id"] },
        razorpay_subscription: { fields: ["id"] },
        belongsTo: { fields: ["id"] },
        product: { fields: ["id", "name"] },
        benefits: { fields: ["id"] },
        subscribedBy: { fields: ["id"] },
      },
    }
  );

  if (subsciptionTrackers.length < 1) {
    throw new Error("Subscription Tracker Id not found");
  }

  const subscriptionData = subsciptionTrackers[0];

  if (!subscriptionData || !subscriptionData.razorpay_subscription.id) {
    throw new Error("Razorpay subscription not found");
  }

  const { subscription, payment } = payload;

  if (
    payment &&
    payment.entity.status === "captured" &&
    payment.entity.amount !== (subscriptionData.amount ?? 0) * 100
  ) {
    console.log("Subscription details mismatch");
    throw new Error("Subscription not paid right");
  }

  const now = new Date();
  const subscriptionExpiresOn = new Date(subscriptionData.expiresOn);

  if (
    subscriptionData.paymentStatus === "paid" &&
    now < subscriptionExpiresOn &&
    subscriptionData.subscriptionStatus === "Active"
  ) {
    console.log(
      `Subscription already paid!, and active ignoring the event with payment id: ${payment.entity.id}`
    );
    return;
  }

  const knex = strapi.db?.connection;

  await knex.transaction(async (trx) => {
    const paymentTransaction = await strapi.entityService.create(
      "api::payment-transaction.payment-transaction",
      {
        data: {
          status: "SUCCESS",
          vendor: "razorpay",
          paymentFor: "SUBSCRIPTION",
          vendorResponse: payment.entity,
          vendorPaymentId: payment.entity.id,
          vendorInvoiceId: payment.entity?.invoice_id ?? undefined,
          transactionDate: new Date(),
          value: (payment.entity.amount ?? 0) / 100,
          paymentMethod: getPaymentMethod(payment.entity.method) ?? "UNKNOWN",
          user: subscriptionData.subscribedBy.id,
        },
        // @ts-ignore
        transacting: trx,
      }
    );

    await strapi.entityService.update(
      "api::razorpay-subscription.razorpay-subscription",
      subscriptionData.razorpay_subscription.id,
      {
        data: {
          status: subscription.entity.status,
          totalCount: subscription.entity.total_count,
          paidCount: subscription.entity.paid_count || 0,
          chargeAt: subscription.entity.charge_at
            ? new Date(subscription.entity.charge_at * 1000)
            : undefined,
          currentStart: subscription.entity.current_start
            ? new Date(subscription.entity.current_start * 1000)
            : undefined,
          currentEnd: subscription.entity.current_end
            ? new Date(subscription.entity.current_end * 1000)
            : undefined,
          shortUrl: subscription.entity.short_url,
          hasScheduledChanges: subscription.entity.has_scheduled_changes,
          remainingCount: subscription.entity.remaining_count,
        },
        // @ts-ignore
        transacting: trx,
      }
    );

    console.log("Updated the razorpay transaction");

    if (
      subscriptionData.paymentStatus === "paid" &&
      now >= subscriptionExpiresOn
    ) {
      await strapi.entityService.create(
        "api::subscription-tracker.subscription-tracker",
        {
          data: {
            ...subscriptionData,
            id: undefined,
            startDate: subscription.entity.current_start
              ? new Date(subscription.entity.current_start * 1000)
              : undefined,
            expiresOn: subscription.entity.current_end
              ? new Date(subscription.entity.current_end * 1000)
              : undefined,
            paymentStatus: "paid",
            family: subscriptionData.family?.id,
            product: subscriptionData.product?.id,
            subscribedBy: subscriptionData.subscribedBy?.id,
            belongsTo: subscriptionData.belongsTo?.map((a) => a.id),
            razorpay_subscription: subscriptionData.razorpay_subscription?.id,
            benefits: subscriptionData.benefits?.map((a) => a.id),
            payment_transactions: paymentTransaction.id
              ? [paymentTransaction.id]
              : null,
          },

          populate: {
            razorpay_subscription: true,
          },
          // @ts-ignore
          transacting: trx,
        }
      );

      await strapi.entityService.update(
        "api::subscription-tracker.subscription-tracker",
        subscriptionData.id,
        {
          data: {
            subscriptionStatus: "Expired",
          },
          // @ts-ignore
          transacting: trx,
        }
      );

      createUserNotification({
        title: "Subscription Renewed",
        message: `Your subscription for ${subscriptionData.product.name} has been auto renewed`,
        user: subscriptionData.subscribedBy.id,
        actionUrl: `/bookingDetailsScreen/${subscriptionData.id}`,
      });

      console.log("Added new subscription, renewal success");
    } else {
      await strapi.entityService.update(
        "api::subscription-tracker.subscription-tracker",
        subscriptionData.id,
        {
          data: {
            paymentStatus: "paid",
            status: "processing",
            startDate: subscription.entity.current_start
              ? new Date(subscription.entity.current_start * 1000)
              : undefined,
            expiresOn: subscription.entity.current_end
              ? new Date(subscription.entity.current_end * 1000)
              : undefined,
            razorpaySubscriptionId: subscription.entity.id,
            payment_transactions: paymentTransaction.id
              ? [paymentTransaction.id]
              : null,
          },
          // @ts-ignore
          transacting: trx,
        }
      );

      createUserNotification({
        title: "Subscription activated",
        message: `Your subscription for ${subscriptionData.product.name} has been successfully processed!`,
        user: subscriptionData.subscribedBy.id,
        actionUrl: `/bookingDetailsScreen/${subscriptionData.id}`,
      });
      console.log("Updated existing subscription");
    }
  });
};

const updateRazorpaySubscription = async (ctx: any, payload: any) => {
  const subscription = payload.subscription.entity;

  const subscriptionId = subscription.id;

  if (!subscriptionId) {
    console.log(
      "subscription id not found in the event subscription.cancelled"
    );

    throw new Error(
      "subscription id not found in the event subscription.cancelled"
    );
  }

  const _s = await strapi.entityService.findMany(
    "api::razorpay-subscription.razorpay-subscription",
    {
      filters: { subscriptionId: { $eq: subscriptionId } },
    }
  );

  if (_s.length < 1) {
    console.log("subscription does not exist for the id:", subscriptionId);

    throw new Error(`subscription does not exist for the id:", subscriptionId`);
  }

  await strapi.entityService.update(
    "api::razorpay-subscription.razorpay-subscription",
    _s?.[0].id,
    {
      data: {
        status: subscription.status,
        totalCount: subscription.total_count,
        paidCount: subscription.paid_count || 0,
        chargeAt: subscription.charge_at
          ? new Date(subscription.charge_at * 1000)
          : undefined,
        currentStart: subscription.current_start
          ? new Date(subscription.current_start * 1000)
          : undefined,
        currentEnd: subscription.current_end
          ? new Date(subscription.current_end * 1000)
          : undefined,
        shortUrl: subscription.short_url,
        hasScheduledChanges: subscription.has_scheduled_changes,
        remainingCount: subscription.remaining_count,
      },
    }
  );
};

const handleOrderPaidEvent = async (ctx: any, payload: any) => {
  const { serviceTrackerId } = payload.order.entity.notes;
  if (!serviceTrackerId) {
    console.log(" Servie Tracker Id not found");

    return;
  }

  const service = await strapi.entityService.findOne(
    "api::service-tracker.service-tracker",
    serviceTrackerId,
    {
      populate: {
        requestedBy: { fields: ["id"] },
      },
    }
  );

  if (
    service.paymentStatus === "paid" ||
    service.paymentStatus === "partiallyPaid"
  ) {
    console.log("order aleady paid");
    return;
  }

  const { order, payment } = payload;
  if (
    !order ||
    !payment ||
    order.entity.status !== "paid" ||
    order.entity.amount !== order.entity.amount_paid ||
    order.entity.amount_paid !== (service.amount ?? 0) * 100
  ) {
    console.log("order details mismatch");
    throw new Error("Order not paid right");
  }

  if (serviceTrackerId) {
    const knex = strapi.db?.connection;

    await knex.transaction(async (trx) => {
      const _payment = await strapi.entityService.create(
        "api::payment-transaction.payment-transaction",
        {
          data: {
            status: "SUCCESS",
            vendor: "razorpay",
            paymentFor: "SERVICE",
            vendorResponse: payment.entity,
            vendorPaymentId: payment.entity.id,
            vendorInvoiceId: payment.entity?.invoice_id ?? undefined,
            transactionDate: new Date(),
            value: (order?.entity?.amount_paid ?? 0) / 100,
            paymentMethod: getPaymentMethod(payment.entity.method) ?? "UNKNOWN",
            user: service.requestedBy.id,
          },
          // @ts-ignore
          transacting: trx,
        }
      );

      await strapi.entityService.update(
        "api::service-tracker.service-tracker",
        serviceTrackerId,
        {
          data: {
            status: "processing",
            paymentStatus: "paid",
            razorpayOrderId: order.entity.id,
            payment_transactions: [_payment.id],
          },
          populate: "*",
          // @ts-ignore
          transacting: trx,
        }
      );
    });
  }
};

function getPaymentMethod(method: string) {
  switch (method) {
    case "card":
      return "CARD";
    case "netbanking":
      return "INTERNETBANKING";
    case "wallet":
      return "WALLET";
    case "emi":
      return "EMI";
    case "upi":
      return "UPI";
    default:
      return "UNKNOWN";
  }
}

const createUserNotification = ({
  title,
  message,
  actionUrl,
  user,
}: {
  title: string;
  message: string;
  user: string | number;
  actionUrl: string;
}) => {
  try {
    strapi.entityService.create("api::user-notification.user-notification", {
      data: {
        title,
        message,
        type: "app",
        read: false,
        actionType: "openPage",
        actionUrl,
        user,
        additionalData: [],
      },
      populate: {
        user: true,
        additionalData: true,
        image: true,
      },
    });
  } catch (error) {
    console.log("Failed to create user notification :", title, error);
  }
};
