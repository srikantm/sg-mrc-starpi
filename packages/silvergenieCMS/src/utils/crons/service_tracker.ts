import { Strapi } from "@strapi/strapi";

export const handleObsoluteServiceTrackers = async (strapi: Strapi) => {
  const now = new Date();
  // Calculate the time for 30 minutes ago
  const _30minAgo = new Date(now.getTime() - 30 * 60 * 1000);
  // Fetch entries that are due and were created more than 30 minutes ago
  try {
    const res = await strapi.db
      .query("api::service-tracker.service-tracker")
      .updateMany({
        data: {
          paymentStatus: "expired",
        },
        where: {
          paymentStatus: "due",
          requestedAt: { $lte: _30minAgo },
        },
      });
    console.log("Updated obsolure service trackers, count: ", res.count);
  } catch (error) {
    console.log("Failed to handle obsolute service_trackers");
  }
};
