import moment from "moment";
import {
  getCompiledHtml,
  getFullUploadPath,
  htmlToPdf,
  isTestEmail,
} from "../../../utils";
const crypto = require("crypto");
import { groupBy, sortBy } from "lodash";
const findUserDetails = async (id: any) => {
  const userDetails: any = await strapi.entityService.findOne(
    "api::user-detail.user-detail",
    id,
    {
      populate: [
        "emergencyContacts",
        "UserInsurance",
        "preferredServices",
        "user",
        "user.address",
      ],
    }
  );
  // const phrData = await strapi.service("api::phr.phr").find({ id });
  const userEmail = userDetails.user?.email;
  if (!userEmail) {
    return userDetails;
  }
  const filename = crypto
    .createHash("md5")
    .update(`${userEmail}--${id}`)
    .digest("hex");
  userDetails["pdfPath"] = `/epr/${filename}.pdf`;
  return userDetails;
};

export default () => ({
  findUserDetails,
  generateEmergencyPdf: async (id) => {
    const userData: any = await findUserDetails(id);

    try {
      const template = "/src/templates/emergency/index.html";
      const pdfPath = `${
        userData?.pdfPath
          ? getFullUploadPath(userData?.pdfPath, userData.user?.email)
          : "/scrap/1.pdf"
      }`;

      const context = { ...userData, ...userData.user };
      context.emergencyContactsGrouped = groupBy(
        context.emergencyContacts,
        (v) => v.contactType
      );
      context.age = moment().diff(moment(userData.user.dateOfBirth), "year");
      context.preferredHospitals = context.preferredServices.filter(
        (pf) => pf.serviceType === "Hospital"
      );
      context.preferredAmbulance = context.preferredServices.filter(
        (pf) => pf.serviceType === "Ambulance"
      );
      if (isTestEmail(context?.email)) {
        context.email = "NA";
      }
      if (isTestEmail(context.belongsTo?.email)) {
        context.belongsTo.email = "NA";
      }
      const htmlcontent = getCompiledHtml(template, context);
      const phrPdfURL = htmlToPdf(htmlcontent, `/public${pdfPath}`);
      userData.pdfPath = `${process.env.STRAPI_ADMIN_BACKEND_URL}${pdfPath}`;
      return userData;
    } catch (error) {
      console.error(error);
      return "";
    }
  },
  updateOrCreateUser: async (filters, data) => {
    let user;
    const existedUserObject = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        filters,
      }
    );
    if (!existedUserObject.length) {
      user = await strapi.entityService.create(
        "plugin::users-permissions.user",
        {
          data,
          populate: "*",
        }
      );
    } else {
      user = await strapi.entityService.update(
        "plugin::users-permissions.user",
        existedUserObject[0].id,
        {
          data,
          populate: "*",
        }
      );
    }
    return user;
  },
});
