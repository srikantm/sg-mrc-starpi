import { Strapi } from "@strapi/strapi";

export const handleObsoluteSubcriptionTrackers = async (strapi: Strapi) => {
  const now = new Date();
  // Calculate the time for 60 minutes ago

  const _60minAgo = new Date(now.getTime() - 60 * 60 * 1000);
  // Fetch entries that are due and were created more than 30 minutes ago
  try {
    const res = await strapi.db
      .query("api::subscription-tracker.subscription-tracker")
      .updateMany({
        data: {
          paymentStatus: "expired",
          subscriptionStatus: "Expired",
        },
        where: {
          paymentStatus: "due",
          createdAt: { $lte: _60minAgo },
        },
      });
    console.log("Updated obsolure subscription trackers, count: ", res.count);
  } catch (error) {
    console.log("Failed to handle obsolute subcription_trackers");
  }
};

export const handleSubcriptionTrackerStatus = async (strapi: Strapi) => {
  try {
    const now = new Date();
    const subscriptionsToBeMarkedExpired = await strapi.entityService.findMany(
      "api::subscription-tracker.subscription-tracker",
      {
        filters: {
          paymentStatus: { $eq: "paid" },
          subscriptionStatus: { $eq: "Active" },
          expiresOn: { $lte: now },
          razorpay_subscription: { status: { $notIn: ["active", "pending"] } },
        },
        populate: {
          razorpay_subscription: true,
        },
      }
    );

    const idsTobemarkedExpired = subscriptionsToBeMarkedExpired.map(
      (s) => s.id
    );

    const res = await strapi.db
      .query("api::subscription-tracker.subscription-tracker")
      .updateMany({
        data: {
          subscriptionStatus: "Expired",
        },
        where: {
          id: { $in: idsTobemarkedExpired },
        },
      });

    console.log("Marked subscription trackers to expired, count: ", res.count);
  } catch (error) {
    console.log("Failed to handle subcription_trackers expired");
  }
};
