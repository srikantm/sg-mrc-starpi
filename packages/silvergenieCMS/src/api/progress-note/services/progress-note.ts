/**
 * progress-note service
 */

import { factories } from "@strapi/strapi";
import pdfServices from "./pdfService";

export default factories.createCoreService(
  "api::progress-note.progress-note",
  ({ strapi }) => ({
    ...pdfServices(),
  })
);
