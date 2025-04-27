// const htmlpdf = require("html-pdf");
// const htmlpdf = require("html-pdf-node");
import * as fs from "fs";
const puppeteer = require("puppeteer");
import { writeFile } from "../common/index";
import { PDF_UPLOAD_PATH } from "../../constants";
const crypto = require("crypto");

export const getFullUploadPath = (partialPath, userEmail = undefined) => {
  let prefixPath = "/";
  // /${dirname}
  if (userEmail) {
    prefixPath =
      prefixPath + crypto.createHash("md5").update(userEmail).digest("hex");
  } else {
    prefixPath = "/others";
  }
  const fullPath = `${PDF_UPLOAD_PATH}${prefixPath}${partialPath}`;
  return fullPath;
};

export const htmlToPdf = async (htmlcontent, pathPdf, options = {}) => {
  try {
    const pdfOptions = {
      printBackground: true,
      format: "A4",
      ...options,
    };

    // let args = ["--no-sandbox", "--disable-setuid-sandbox"];
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlcontent, {
      waitUntil: "networkidle0", // wait for page to load completely
    });
    const output = await page.pdf(pdfOptions);
    writeFile(pathPdf.replace(".pdf", ".html"), htmlcontent);
    writeFile(pathPdf, output);
    await browser.close();
  } catch (error) {
    throw error;
    console.log("error to generate html to pdf");
  }
};
