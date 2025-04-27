/**
 * user-notification controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::user-notification.user-notification",
  ({ strapi }) => ({
    async find(ctx) {
      const user = ctx.state.user;

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const notifications = await strapi.entityService.findMany(
        "api::user-notification.user-notification",
        {
          filters: {
            user: { id: { $eq: user.id } },
            createdAt: { $gte: oneMonthAgo },
          },
          limit: 100,
          sort: "createdAt:desc",
          populate: {
            image: true,
            additionalData: true,
          },
        }
      );
      const sanitizedResults = await this.sanitizeOutput(notifications, ctx);
      return this.transformResponse(sanitizedResults);
    },
    async markAsRead(ctx) {
      const user = ctx.state.user;

      const { id } = ctx.params;

      if (!id) {
        return ctx.badRequest("Notification ID is required");
      }

      const notification = await strapi.entityService.findOne(
        "api::user-notification.user-notification",
        id,
        {
          populate: { user: true },
        }
      );

      if (!notification) {
        return ctx.badRequest("Invalid notification ID!");
      }

      if (notification.user.id !== user.id) {
        return ctx.unauthorized("No access!");
      }

      try {
        await strapi.entityService.update(
          "api::user-notification.user-notification",
          id,
          {
            data: {
              read: true,
              readAt: new Date(),
            },
          }
        );

        return ctx.send({});
      } catch (err) {
        return ctx.internalServerError("Failed to update notification");
      }
    },
  })
);
