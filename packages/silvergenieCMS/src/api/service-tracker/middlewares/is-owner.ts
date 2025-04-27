import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const user = ctx.state.user;

    const { id } = ctx.params;

    const serviceTracker = await strapi.entityService.findOne(
      "api::service-tracker.service-tracker",
      id,
      {
        populate: {
          requestedBy: {
            fields: ["id"],
          },
        },
      }
    );

    if (!serviceTracker) {
      return ctx.badRequest("Not Found Error!");
    }

    if (
      !serviceTracker.requestedBy.id ||
      serviceTracker.requestedBy.id !== user.id
    ) {
      return ctx.unauthorized("You are not the authorized!");
    }
    await next();
  };
};
