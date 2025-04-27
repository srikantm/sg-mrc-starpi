/**
 * A set of functions called "actions" for `utils`
 */
import { responseService } from "../../../utils";

export default {
  generatePdf: async (ctx, next) => {
    const { id } = ctx.request.params;
    // const
    // const userHash=''
    // const fileHash=''
    const phrData = await strapi.service("api::phr.phr").generatePhrPdf(id);
    if (!phrData) {
      return new responseService(ctx, "NO PHR data found", "NO_PHR_FOUND").OK(
        {}
      );
    }
    // console.log(phrData);
    try {
      ctx.body = phrData;

      // ctx.body = await readFile(`/public/uploads/pdf${phrData.pdfPath}`);
      // ctx.response.attachment("phr.pdf");

      // ctx.response.redirect(`/uploads/pdf${phrData.pdfPath}`);
    } catch (err) {
      ctx.body = err;
    }
  },

  getPdf: async (ctx, next) => {
    const { id } = ctx.request.params;
    const phrData = await strapi.service("api::phr.phr").generatePhrPdf(id);
    if (!phrData) {
      return new responseService(ctx, "NO PHR data found", "NO_PHR_FOUND").OK(
        {}
      );
    }
    // const phrData = await strapi.service("api::phr.phr").findPhrWithPdf(id);
    try {
      // ctx.body = phrData;

      // ctx.body = await readFile(`/public/uploads/pdf${phrData.pdfPath}`);
      // ctx.response.attachment("phr.pdf");

      ctx.response.redirect(
        // phrData?.pdfPath.replace(".pdf", ".html")
        phrData?.pdfPath

        // getFullUploadPath(
        //   // phrData?.pdfPath.replace(".pdf", ".html"),
        //   phrData?.pdfPath,
        //   phrData.belongsTo?.email
        // )
      );
    } catch (err) {
      ctx.body = err;
    }
  },
};
