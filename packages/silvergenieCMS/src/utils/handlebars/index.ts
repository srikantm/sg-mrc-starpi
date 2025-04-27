import Handlebars from "handlebars";
import * as fs from "fs";
import * as ps from "path";
import { htmlToPdf } from "../pdf";
import { getBasePath, writeFile } from "../common";
import moment from "moment";

export const getHandleBars = () => {
  const BasePath = getBasePath();
  const headerPath = "/src/templates/partials/header.html";
  const footerPath = "/src/templates/partials/footer.html";
  const headerSource = fs
    .readFileSync(BasePath + headerPath, "utf-8")
    .toString();
  const footerSource = fs
    .readFileSync(BasePath + footerPath, "utf-8")
    .toString();
  Handlebars.registerPartial("header", headerSource);
  Handlebars.registerPartial("footer", footerSource);
  Handlebars.registerHelper("formatDate", (date) => {
    if (!date) return "NA";
    return moment(date).format("DD MMM YYYY");
  });
  // Handlebars.registerHelper("checklength", function (v1, v2, options) {
  //   "use strict";

  //   if (v1.length > v2) {
  //     return options.fn(this);
  //   }
  //   return options.inverse(this);
  // });

  Handlebars.registerHelper("length", function (v1, v2) {
    "use strict";
    console.log(v1, "checccck");
    if (v1.length) return true;
    else {
      return false;
    }
  });

  Handlebars.registerHelper("getProfileUrl", (phr) => {
    if (phr.profile && phr.profile.url) {
      return phr.profile.url;
    } else if (phr.gender.toLowerCase() == "female") {
      return "/uploads/pdf/phr-img/phr-women.7993a119.png";
    } else {
      return "/uploads/pdf/phr-img/person.4a4a232c.png";
    }
  });
  Handlebars.registerHelper("flatlist", (list) => {
    if (!list || !list.length) return "";
    return list.map((vv) => vv.name).join(",");
  });

  Handlebars.registerHelper("add", (val1, val2) => {
    return val1 + val2;
  });

  Handlebars.registerHelper("placeholderImage", (val1) => {
    return val1 || "/uploads/pdf/phr-img/no-image.png";
  });

  Handlebars.registerHelper("defaultValue", (value, defaultValue) => {
    return value ? value : defaultValue || "-";
  });

  Handlebars.registerHelper("placeholder", (string) => {
    return string || "No Data Available";
  });

  Handlebars.registerHelper("json", (data) => {
    return JSON.stringify(data);
  });

  Handlebars.registerHelper("absoluteUrl", (data) => {
    const k = `${process.env.STRAPI_ADMIN_BACKEND_URL}${data}`;
    return k;
  });
  return Handlebars;
};

export const getCompiledHtml = (template: string, context: any = {}) => {
  const BasePath = getBasePath();
  const templatePath = BasePath + template;
  const templateSource = fs.readFileSync(templatePath, "utf-8").toString();
  const HB = getHandleBars();
  const handleBarTemplate = HB.compile(templateSource);
  const htmlcontent = handleBarTemplate({
    ...context,
    mainEnv: process.env,
  });
  return htmlcontent;
};
