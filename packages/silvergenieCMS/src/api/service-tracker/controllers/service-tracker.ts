/**
 * service-tracker controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::service-tracker.service-tracker",
  ({ strapi }) => ({
    async findOne(ctx) {
      this.validateQuery(ctx);

      const user = ctx.state.user;

      const { id } = ctx.params;
      const result = await strapi.entityService.findOne(
        "api::service-tracker.service-tracker",
        id,
        {
          populate: {
            metadata: true,
            product: {
              fields: ["category", "name", "type"],
            },
            requestedBy: { fields: ["id"] },
            requestedFor: {
              fields: ["firstName", "lastName", "gender", "relation"],
              populate: { profileImg: true },
            },
            payment_transactions: {
              fields: ["vendorInvoiceId", "id"],
              populate: { invoice: true },
            },
            priceDetails: {
              populate: { products: true, taxes: true, discounts: true },
            },
          },
        }
      );

      if (!result) {
        return ctx.notFound();
      }

      if (result.requestedBy?.id !== user.id) {
        return ctx.unauthorized();
      }

      return this.sanitizeOutput(result, ctx);
    },
  })
);
