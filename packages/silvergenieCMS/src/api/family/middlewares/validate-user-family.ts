import { Strapi } from "@strapi/strapi";
import { responseService } from "../../../utils";
export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const me = ctx.state.user;
    const userId = ctx.params.id ?? ctx.params.userId ?? ctx.query.userId;

    const familyUser = await strapi.entityService.findMany(
      "api::family.family",
      {
        filters: {
          users: me.id,
        },
        populate: "*",
      }
    );

    if (familyUser.length < 1) {
      return new responseService(ctx).BAD_REQUEST;
    }
    if (!familyUser[0].users.find((e) => e.id == userId)) {
      return new responseService(ctx).BAD_REQUEST;
    }

    await next();
  };
};
