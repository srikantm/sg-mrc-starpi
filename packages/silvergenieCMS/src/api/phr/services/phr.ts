/**
 * phr service
 */

import { factories } from "@strapi/strapi";
import phrPdfServices from "./phrPdf";

export default factories.createCoreService("api::phr.phr", ({ strapi }) => ({
  ...phrPdfServices(),
}));
