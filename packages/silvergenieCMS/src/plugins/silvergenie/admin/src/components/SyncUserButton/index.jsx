import { Button } from "@strapi/design-system";
import React from "react";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
// import

// const SLUG_WHOLE_DB = "custom:db";

const openUrl = (url, target = undefined, features = undefined) => {
  const newWindow = window.open(url, target, features);
  if (newWindow) newWindow.opener = null;
};

const contentTypeMap = {
  // "api::phr.phr": "/api/phr/pdf/",
  // "api::user-detail.user-detail": "/api/user/epr/pdf/",
  "plugin::users-permissions.user": "/api/utils/sync/userwithfilter/",
};
export const SyncUserButton = (props) => {
  const { pathname, ...other } = useLocation();

  const keys = Object.keys(contentTypeMap);
  console.log(props.slug, "SyncUserButton");

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
  const data = useCMEditViewDataManager();
  // console.log(data);
  const downloadPhr = () => {
    openUrl(
      `${contentTypeMap[props.slug]}?email=${data.modifiedData.email}`,
      "__blank"
    );
  };

  return <Button onClick={downloadPhr}>Sync User</Button>;
};
