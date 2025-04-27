import { Button } from "@strapi/design-system";
import React from "react";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import { openUrl } from "../../utils";
// import

// const SLUG_WHOLE_DB = "custom:db";

const contentTypeMap = {
  "api::phr.phr": "/api/phr/pdf/",
  "api::user-detail.user-detail": "/api/user/epr/pdf/",
  "api::progress-note.progress-note": "/api/progress-note/pdf/",
  // "plugin::users-permissions.user": "/api/user/epr/pdf/",
};
export const DownloadDocumentButton = (props) => {
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
  console.log(contentTypeId, "contentTypeId");
  // const { modifiedData, ...otherThings } = useCMEditViewDataManager();

  // // const isSlugWholeDb = useMemo(() => slug === SLUG_WHOLE_DB, [slug]);
  const downloadPhr = () => {
    openUrl(`${contentTypeMap[props.slug]}${contentTypeId ?? 1}`, "__blank");
  };

  return <Button onClick={downloadPhr}>Download Document</Button>;
};
