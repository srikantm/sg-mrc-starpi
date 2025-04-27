/**
 * subscription-tracker controller
 */

import { factories } from "@strapi/strapi";
import { responseService } from "../../../utils";

export default factories.createCoreController(
  "api::subscription-tracker.subscription-tracker",
  ({ strapi }) => ({
    async findOne(ctx) {
      this.validateQuery(ctx);

      const user = ctx.state.user;

      const { id } = ctx.params;
      const result = await strapi.entityService.findOne(
        "api::subscription-tracker.subscription-tracker",
        id,
        {
          populate: {
            metadata: true,
            product: {
              fields: ["category", "name", "type"],
              populate: { prices: true },
            },
            subscribedBy: {
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
            payment_transactions: {
              fields: ["vendorInvoiceId", "id"],
              populate: { invoice: true },
            },
          },
        }
      );

      if (!result) {
        return ctx.notFound();
      }

      if (result.subscribedBy?.id !== user.id) {
        return ctx.unauthorized();
      }

      return new responseService(
        ctx,
        "Subscription fetched successfully",
        "SUCCESS"
      ).OK(result);
    },
  })
);
