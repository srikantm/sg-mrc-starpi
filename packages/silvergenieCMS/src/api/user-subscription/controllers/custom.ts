import { responseService } from "../../../utils";
import _ from "lodash";

export default {
  createSubscription: async (ctx, next) => {
    try {
      // Get razorpay key.
      const razorpay_api_key: string = process.env.RAZORPAY_KEY;

      // Validate razorpay key is exist or not.
      if (!razorpay_api_key) {
        throw new Error("Server error! ");
      }

      const {
        priceId,
        productId,
        familyMemberIds = [],
      }: {
        priceId: number;
        productId: number;
        familyMemberIds: Array<number>;
      } = ctx.request.body;

      const me = ctx.state.user;

      if (!productId || familyMemberIds.length < 1 || !priceId) {
        return new responseService(ctx, "Pass all required parameters!")
          .BAD_REQUEST;
      }

      const authUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        me.id,
        {
          populate: {
            family: {
              populate: {
                users: {
                  populate: { subscriptions: { populate: "*" } },
                },
              },
            },
          },
        }
      );

      const family = authUser.family;

      if (!family || !family.isActive) {
        return new responseService(
          ctx,
          "Invalid family member selected for service"
        ).BAD_REQUEST;
      }

      const authUserFamilyMemberIds = family?.users?.map((u) => u.id) ?? [];

      if (
        authUserFamilyMemberIds.length < 1 ||
        !authUserFamilyMemberIds.includes(me.id)
      ) {
        return new responseService(ctx, "Invalid family access").BAD_REQUEST;
      }
      /// If all the members belong to the same family
      if (
        !familyMemberIds.every((id) => authUserFamilyMemberIds.includes(id))
      ) {
        return new responseService(ctx, "Invalid family access").BAD_REQUEST;
      }

      const members = family.users.filter((u) =>
        familyMemberIds.includes(Number(u.id))
      );

      if (members.length !== familyMemberIds.length) {
        return new responseService(
          ctx,
          "Invalid family member selected for service"
        ).BAD_REQUEST;
      }

      /// If any of the member already has any subscription active
      if (
        members.some(
          (m) =>
            !m.isFamilyMember ||
            m.blocked ||
            m.subscriptions.some(
              (s) =>
                s.paymentStatus === "paid" && s.subscriptionStatus === "Active"
            )
        )
      ) {
        return new responseService(
          ctx,
          "Falure, either subscription already exists! or family is not a family member or blocker"
        ).BAD_REQUEST;
      }

      // Get the product using productId
      const productData = await strapi.entityService.findOne(
        "api::product.product",
        productId,
        {
          populate: "*",
        }
      );

      // Check the product is exist or not.
      if (!productData) {
        return new responseService(ctx, "Invalid productId").BAD_REQUEST;
      }

      // The product is active or not.
      if (!productData.isActive) {
        return new responseService(ctx, "Product is not active").BAD_REQUEST;
      }

      // The product type should be subscription.
      if (productData.type !== "subscription") {
        return new responseService(ctx, "Product type is not subscription")
          .BAD_REQUEST;
      }

      // Find the price using priceId.
      const priceData = productData.prices.find(
        (price) => price.id === priceId
      );

      // Check the price is exist or not.
      if (!priceData) {
        return new responseService(ctx, "Invalid planId").BAD_REQUEST;
      }

      /// Plan does not support no of familymembers trying to apply
      if (
        priceData.benefitApplicableToMembersLimit !== familyMemberIds.length
      ) {
        return new responseService(ctx, "Incorrect Request!").BAD_REQUEST;
      }

      // Get the razorpay plan id.
      let razorpayPlanId = priceData.recurringPlanId;

      // Create a Razorpay plan ID. When the Razorpay plan ID is missing.
      if (!razorpayPlanId) {
        const plan = await createPlanOnRazorpay(
          priceData,
          productData,
          priceId,
          productId
        );
        razorpayPlanId = plan.id;
      }

      // Verify the plan on the Razorpay.
      const razorpayPlan = await strapi
        .service("api::utils.utils")
        .getRazorpayPlan({
          planId: razorpayPlanId,
        });

      // Create a Razorpay plan ID. When we have Razorpay plan ID but some how we don't find a Razorpay plan on Razorpay Dashboard.
      if (!razorpayPlan) {
        const plan = await createPlanOnRazorpay(
          priceData,
          productData,
          priceId,
          productId
        );
        razorpayPlanId = plan.id;
      }

      // Create an expiry date according to the plan.
      let expiresOn: Date;

      if (priceData.recurringInterval === "monthly") {
        const interval = priceData.recurringIntervalCount || 1;
        const expireDate = new Date();
        expireDate.setMonth(expireDate.getMonth() + interval);
        expiresOn = expireDate;
      }

      if (priceData.recurringInterval === "yearly") {
        const interval = priceData.recurringIntervalCount || 1;
        const expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + interval);
        expiresOn = expireDate;
      }

      if (!expiresOn) {
        return new responseService(ctx, "Some issue in the plan.").BAD_REQUEST;
      }

      const subscription = await strapi
        .service("api::utils.utils")
        .createRazorpaySubscription({
          planId: razorpayPlanId,
        });

      if (!subscription) {
        return ctx.internalServerError(
          "Failed to create subscription from Razorpay!"
        );
      }

      if (!subscription.id || !subscription.plan_id) {
        return ctx.internalServerError(
          "Failed to create subscription from Razorpay!"
        );
      }

      const knex = strapi.db?.connection;

      const subscriptionTracker = await knex.transaction(async (trx) => {
        const razorpaySubscription = await strapi.entityService.create(
          "api::razorpay-subscription.razorpay-subscription",
          {
            data: {
              subscriptionId: subscription.id,
              planId: subscription.plan_id,
              status: subscription.status || "created",
              customerId: subscription.customer_id,
              totalCount: subscription.total_count,
              paidCount: subscription.paid_count || 0,
              chargeAt: subscription.charge_at
                ? new Date(subscription.charge_at * 1000)
                : undefined,
              shortUrl: subscription.short_url,
              hasScheduledChanges: subscription.has_scheduled_changes,
              remainingCount: subscription.remaining_count,
              paymentMethod: subscription.payment_method,
            },
          }
        );

        return strapi.entityService.create(
          "api::subscription-tracker.subscription-tracker",
          {
            data: {
              paymentStatus: "due",
              status: "requested",
              expiresOn: expiresOn,
              startDate: new Date(),
              amount: Number(priceData.unitAmount),
              subscribedBy: me.id,
              belongsTo: familyMemberIds,
              product: productId,
              priceId: Number(priceId),
              family: family.id,
              razorpaySubscriptionId: razorpaySubscription.subscriptionId,
              razorpay_subscription: razorpaySubscription.id,
              priceDetail: {
                products: [
                  {
                    priceId: priceId.toString(),
                    productId: productId.toString(),
                    productName: productData.name,
                    displayName:
                      priceData.label == null
                        ? `${productData.name} ${
                            priceData.benefitApplicableToMembersLimit == 2
                              ? "(Couple)"
                              : "(Single)"
                          }`
                        : `${productData.name} ${priceData.label} ${
                            priceData.benefitApplicableToMembersLimit == 2
                              ? "(Couple)"
                              : "(Single)"
                          }`,
                    price: Number(priceData.unitAmount),
                    quantity: 1,
                  },
                ],
                totalAmount: Number(priceData.unitAmount),
                subTotal: Number(priceData.unitAmount),
                totalDiscount: 0,
                totalTax: 0,
              },
              benefits:
                productData.benefits.length > 0
                  ? productData.benefits.map((benefit) => benefit.id)
                  : [],
            },
            populate: "*",
            // @ts-ignore
            transacting: trx,
          }
        );
      });

      return new responseService(
        ctx,
        "Subscription created.",
        "SUBSCRIPTION"
      ).OK({
        id: subscriptionTracker.id,
        paymentStatus: subscriptionTracker.paymentStatus,
        status: subscriptionTracker.status,
        expiresOn: subscriptionTracker.expiresOn,
        startDate: subscriptionTracker.startDate,
        priceId: subscriptionTracker.priceId,
        createdAt: subscriptionTracker.createdAt,
        updatedAt: subscriptionTracker.updatedAt,
        product: productData,
        userId: me.id,
        familyMemberIds: familyMemberIds,
        amount: Number(priceData.unitAmount),
        razorpaySubscriptionId: subscription.id,
        razorpay_api_key,
      });
    } catch (err) {
      console.log("err : ", err);

      return ctx.internalServerError(JSON.stringify(err), "ERROR");
    }
  },
  getSubscription: async (ctx, next) => {
    try {
      const userId = ctx.state.user.id;

      const subscriptions = await strapi.entityService.findMany(
        "api::subscription-tracker.subscription-tracker",
        {
          filters: {
            subscribedBy: userId,
          },
          populate: {
            metadata: true,
            product: {
              fields: ["category", "name", "type"],
              populate: { prices: true },
            },
            user: {
              fields: [
                "id",
                "firstName",
                "lastName",
                "gender",
                "relation",
                "dateOfBirth",
              ],
              populate: { profileImg: true },
            },
            belongsTo: {
              fields: [
                "id",
                "firstName",
                "lastName",
                "gender",
                "relation",
                "dateOfBirth",
              ],
              populate: { profileImg: true },
            },
            payment_transactions: true,
          },
        }
      );

      return new responseService(
        ctx,
        "Subscription fetched successfully",
        "SUCCESS"
      ).OK(subscriptions);
    } catch (err) {
      console.log("err : ", err);
      return new responseService(ctx, JSON.stringify(err), "ERROR").BAD_REQUEST;
    }
  },
};

const createPlanOnRazorpay = async (
  priceData,
  productData,
  priceId,
  productId
) => {
  // Create a Razorpay plan ID.
  const plan = await strapi.service("api::utils.utils").createRazorpayPlan({
    name: priceData.label,
    description: priceData.label,
    period: priceData.recurringInterval,
    price: priceData.unitAmount * 100,
    interval: priceData.recurringIntervalCount,
  });

  // Store Razorpay plan ID into a selected price.
  const newPrices = productData.prices.map((price) => {
    if (price.id === priceId) {
      return { ...price, recurringPlanId: plan.id };
    }
    return price;
  });

  // Update a product.
  await strapi.entityService.update("api::product.product", productId, {
    data: {
      prices: newPrices,
    },
  });

  return plan;
};
