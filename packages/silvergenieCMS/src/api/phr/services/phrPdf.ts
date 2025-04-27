import {
  getCompiledHtml,
  htmlToPdf,
  getFullUploadPath,
  isTestEmail,
} from "../../../utils";
const crypto = require("crypto");
import { groupBy, sortBy } from "lodash";
const findPhrWithPdf = async (id: any) => {
  const phrData: any = await strapi.entityService.findOne("api::phr.phr", id, {
    populate: [
      "prescription.Medicine",
      "prescription.alternateMedicine",
      "prescription.media",
      "prescription.doctorType",
      "documents",
      "address",
      "chronicCondition.condition",
      "vaccineRecords",
      "diagnosedServices.serviceName",
      "diagnosedServices.serviceProvider",
      "diagnosedServices.media",
      "medicalConditions.condition",
      "covidVaccines",
      "allergies",
      "fitnessRegime",
      "belongsTo",
      "createdBy",
      "updatedBy",
    ],
    // populate: "*",
  });
  if (!phrData) {
    return;
  }
  // const phrData = await strapi.service("api::phr.phr").find({ id });
  const userEmail = phrData.belongsTo?.email;
  if (!userEmail) {
    return phrData;
  }
  const filename = crypto
    .createHash("md5")
    .update(`${userEmail}--${id}`)
    .digest("hex");
  phrData["pdfPath"] = `/phr/${filename}.pdf`;
  return phrData;
};

export default () => ({
  findPhrWithPdf,
  generatePhrPdf: async (id) => {
    const phrData = await findPhrWithPdf(id);
    if (!phrData) {
      return;
    }
    try {
      const template = "/src/templates/phr/index.html";
      const pdfPath = `${
        phrData?.pdfPath
          ? getFullUploadPath(phrData?.pdfPath, phrData.belongsTo?.email)
          : "/scrap/1.pdf"
      }`;

      const chronicConditionGrouped = groupBy(
        phrData.chronicCondition,
        (v) => v.condition?.name
      );
      const emergencyContacts = await strapi.db
        .query("api::user-detail.user-detail")
        .findOne({
          where: {
            user: phrData.belongsTo.id,
          },
          populate: ["emergencyContacts"],
        });
      phrData.emergencyContacts = emergencyContacts?.emergencyContacts;
      phrData.emergencyContactsGrouped = groupBy(
        phrData.emergencyContacts,
        (v) => v.contactType
      );

      phrData.medicalConditionsGrouped = groupBy(
        phrData.medicalConditions,
        (v) => v.conditionType
      );
      phrData.chronicConditionGrouped = [];
      for (let key in chronicConditionGrouped) {
        const cc: any = {};
        cc.label = key;
        cc.value = sortBy(
          chronicConditionGrouped[key],
          (o) => o.diagnosedDate
        ).slice(0, 3);
        phrData.chronicConditionGrouped.push(cc);
      }
      phrData.diagnosedServices = phrData.diagnosedServices.filter(
        (ds) => ds.publish
      );
      phrData.prescription = phrData.prescription.filter((ds) => ds.publish);

      if (isTestEmail(phrData.email)) {
        phrData.email = "NA";
      }
      if (isTestEmail(phrData.belongsTo.email)) {
        phrData.belongsTo.email = "NA";
      }
      const htmlcontent = getCompiledHtml(template, phrData);
      const phrPdfURL = htmlToPdf(htmlcontent, `/public${pdfPath}`);
      phrData.pdfPath = `${process.env.STRAPI_ADMIN_BACKEND_URL}${pdfPath}`;
      return phrData;
    } catch (error) {
      console.error(error);
      return "";
    }
    // console.log(phrData);
  },
  updateOrCreatePhr: async (filters, data) => {
    let phr;
    const existedPhrObject = await strapi.entityService.findMany(
      "api::phr.phr",
      {
        filters,
      }
    );
    if (!existedPhrObject.length) {
      phr = await strapi.entityService.create("api::phr.phr", {
        data,
      });
    } else {
      phr = await strapi.entityService.update(
        "api::phr.phr",
        existedPhrObject[0].id,
        {
          data,
        }
      );
    }
    return phr;
  },
});
