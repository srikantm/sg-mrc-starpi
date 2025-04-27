import { Strapi } from "@strapi/strapi";
import { responseService } from "../../../utils";
export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const address = ctx.request.body.address;
    if (
      address &&
      (!address.city ||
        !address.state ||
        !address.country ||
        !address.postalCode ||
        !address.streetAddress)
    ) {
      return new responseService(ctx, "Invalid Address").BAD_REQUEST;
    }

    return await next();
  };
};
