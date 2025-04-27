import {
  getCompiledHtml,
  htmlToPdf,
  getFullUploadPath,
  isTestEmail,
} from "../../../utils";
import { jsonToHtml } from "@contentstack/json-rte-serializer";

const crypto = require("crypto");
import { groupBy, sortBy } from "lodash";
const findPhrWithPdf = async (id: any) => {
  const progressNoteData: any = await strapi.entityService.findOne(
    "api::progress-note.progress-note",
    id,
    {
      populate: "*",
      // populate: "*",
    }
  );
  console.log("🚀 ~ findPhrWithPdf ~ progressNoteData:", progressNoteData);
  if (!progressNoteData) {
    return;
  }
  // const progressNoteData = await strapi.service("api::progress-note.progress-note").find({ id });
  const userEmail = progressNoteData.client?.email;
  if (!userEmail) {
    return progressNoteData;
  }
  const filename = crypto
    .createHash("md5")
    .update(`${userEmail}--${id}`)
    .digest("hex");
  progressNoteData["pdfPath"] = `/progress-note/${filename}.pdf`;
  return progressNoteData;
};

export default () => ({
  findPhrWithPdf,
  generatePhrPdf: async (id) => {
    const progressNoteData = await findPhrWithPdf(id);
    if (!progressNoteData) {
      return;
    }
    try {
      const template = "/src/templates/progress-note/index.html";
      const pdfPath = `${
        progressNoteData?.pdfPath
          ? getFullUploadPath(
              progressNoteData?.pdfPath,
              progressNoteData.client?.email
            )
          : "/scrap/1.pdf"
      }`;
      progressNoteData.clientReport = jsonToHtml({
        type: "doc",
        children: progressNoteData.clientReport,
      });

      progressNoteData.familyReport = jsonToHtml({
        type: "doc",
        children: progressNoteData.familyReport,
      });

      progressNoteData.physicalStatus = jsonToHtml({
        type: "doc",
        children: progressNoteData.physicalStatus,
      });

      progressNoteData.vitalSigns = jsonToHtml({
        type: "doc",
        children: progressNoteData.vitalSigns,
      });

      progressNoteData.mobility = jsonToHtml({
        type: "doc",
        children: progressNoteData.mobility,
      });

      progressNoteData.skin = jsonToHtml({
        type: "doc",
        children: progressNoteData.skin,
      });

      progressNoteData.emotionalStatus = jsonToHtml({
        type: "doc",
        children: progressNoteData.emotionalStatus,
      });

      progressNoteData.progressAssessment = jsonToHtml({
        type: "doc",
        children: progressNoteData.progressAssessment,
      });

      progressNoteData.painAssessment = jsonToHtml({
        type: "doc",
        children: progressNoteData.painAssessment,
      });

      progressNoteData.emotionalAssessment = jsonToHtml({
        type: "doc",
        children: progressNoteData.emotionalAssessment,
      });
      progressNoteData.careAdjustment = jsonToHtml({
        type: "doc",
        children: progressNoteData.careAdjustment,
      });
      progressNoteData.followUp = jsonToHtml({
        type: "doc",
        children: progressNoteData.followUp,
      });
      progressNoteData.familyGuidance = jsonToHtml({
        type: "doc",
        children: progressNoteData.familyGuidance,
      });
      progressNoteData.medicalConsults = jsonToHtml({
        type: "doc",
        children: progressNoteData.medicalConsults,
      });

      progressNoteData.overallStatus = jsonToHtml({
        type: "doc",
        children: progressNoteData.overallStatus,
      });

      const htmlcontent = getCompiledHtml(template, {
        ...progressNoteData,
        ...progressNoteData.client,
      });
      const phrPdfURL = htmlToPdf(htmlcontent, `/public${pdfPath}`);
      console.log(phrPdfURL);
      progressNoteData.pdfPath = `${process.env.STRAPI_ADMIN_BACKEND_URL}${pdfPath}`;
      return progressNoteData;
    } catch (error) {
      console.error(error);
      return "";
    }
    // console.log(phrData);
  },
  updateOrCreatePhr: async (filters, data) => {
    let phr;
    const existedPhrObject = await strapi.entityService.findMany(
      "api::progress-note.progress-note",
      {
        filters,
      }
    );
    if (!existedPhrObject.length) {
      phr = await strapi.entityService.create(
        "api::progress-note.progress-note",
        {
          data,
        }
      );
    } else {
      phr = await strapi.entityService.update(
        "api::progress-note.progress-note",
        existedPhrObject[0].id,
        {
          data,
        }
      );
    }
    return phr;
  },
});
