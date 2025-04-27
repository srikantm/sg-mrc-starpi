/**
 * user-detail service
 */

import { factories } from "@strapi/strapi";
import emergencyPdfServices from "./emergencyPdf";

export default factories.createCoreService(
  "api::user-detail.user-detail",
  ({ strapi }) => ({
    ...emergencyPdfServices(),
  })
);
