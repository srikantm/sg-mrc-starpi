import { Button } from "@strapi/design-system";
import React from "react";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import axiosInstance from "../../utils/axiosInstance";
const blobDownload = (data, filename, mime, bom) => {
  var blobData = typeof bom !== "undefined" ? [bom, data] : [data];
  var blob = new Blob(blobData, { type: mime || "application/octet-stream" });
  if (typeof window.navigator.msSaveBlob !== "undefined") {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var blobURL =
      window.URL && window.URL.createObjectURL
        ? window.URL.createObjectURL(blob)
        : window.webkitURL.createObjectURL(blob);
    var tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", filename);

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }

    document.body.appendChild(tempLink);
    tempLink.click();

    // Fixes "webkit blob resource error 1"
    setTimeout(function () {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }, 200);
  }
};
// import

// const SLUG_WHOLE_DB = "custom:db";

const openUrl = (url, target = undefined, features = undefined) => {
  const newWindow = window.open(url, target, features);
  if (newWindow) newWindow.opener = null;
};

const contentTypeMap = {
  "api::silver-form.silver-form": "SILVER_FORM",
};
export const DownloadCSV = (props) => {
  const { pathname, ...other } = useLocation();

  const keys = Object.keys(contentTypeMap);

  if (!keys.includes(props.slug)) {
    return "";
  }
  const contentTypeId = useMemo(() => {
    const matches = pathname.match(
      /content-manager\/(collection-types|single-types)\/([a-zA-Z0-9\-:_.]*)\/([0-9]*)/
    );
    const l = matches?.[3] ? matches[3] : "";
    return l;
    // return l.split("/")[l.length - 1];
  }, [pathname]);

  const downloadPhr = async () => {
    // openUrl(`/api/forms/csv/${contentTypeId}`, "__blank");
    const data = await axiosInstance.get(`/api/forms/csv/${contentTypeId}`);
    blobDownload(data.data, "form.csv");
  };

  return <Button onClick={downloadPhr}>Download CSV</Button>;
};
