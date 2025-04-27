import React, { useState, useEffect, useMemo } from "react";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";

import {
  FieldAction,
  FieldInput,
  FieldLabel,
} from "@strapi/design-system/Field";

import { Stack } from "@strapi/design-system/Stack";
import Refresh from "@strapi/icons/Refresh";
import StrikeThrough from "@strapi/icons/StrikeThrough";
import styled from "styled-components";
import { throttle } from "lodash";
import cyrToLat from "./cyr-to-lat";

const Index = ({ name, value, intlLabel, attribute }) => {
  const { modifiedData, onChange, ...otherThings } = useCMEditViewDataManager();

  function slugify(str) {
    str = str.toLowerCase();
    return cyrToLat(str)
      .replace(/[^a-zA-Z0-9]/g, " ")
      .trim()
      .replaceAll(/\s\s+/g, " ")
      .replaceAll(" ", "-");
  }

  const constructSlugFromDataManager = () => {
    const SlugKeys = attribute.options.attributes?.replace(" ", "")?.split(",");
    const values = [];
    SlugKeys?.forEach((key) => {
      const objectKeys = key.split(".");
      if (objectKeys.length) {
        const value = objectKeys.reduce((a, b) => {
          // console.log(a, b);
          try {
            if (Array.isArray(a[b])) {
              if (a[b][0]) return a[b][0];
            }
            if (a[b]) return a[b];
          } catch (error) {
            console.error(error, "plugin error", a, b);
            return undefined;
          }
        }, modifiedData);
        if (value) {
          values.push(value);
        }
      } else if (modifiedData[key]) {
        values.push(modifiedData[key]);
      }
    });
    return values.join(" ");
  };
  const throttledConstructSlugFromDataManager = throttle(
    constructSlugFromDataManager,
    1000,
    { leading: true }
  );

  const slugValue = useMemo(constructSlugFromDataManager, [modifiedData]);

  useEffect(() => {
    // console.log(modifiedData, otherThings, "entityKey");
    throttledSetValue(slugValue);
  }, [slugValue]);

  const setValue = (value) => {
    onChange({ target: { name, value: slugify(value), type: "text" } });
  };
  const throttledSetValue = throttle(setValue, 1000, { leading: true });

  return (
    <Stack spacing={1}>
      <FieldLabel>{intlLabel?.defaultMessage}</FieldLabel>

      <FieldInput
        label="Unique Entity Key"
        name="entityKey"
        value={value || ""}
        disabled={true}
        //     onChange={(e) => {
        //       if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
        //         onChange({ target: { name, value: e.target.value } });
        //       }
        // }}
        // onChange={(e) =>
        //   onChange({
        //     target: { name, value: slugify(e.target.value) },
        //   })
        // }
        // endAction={
        //   <Stack horizontal spacing={2}>
        //     {/* <FieldActionWrapper
        //       onClick={() => generateSlug_by_Title()}
        //       label="regenerate"
        //     >
        //       <StrikeThrough />
        //     </FieldActionWrapper> */}
        //     <FieldActionWrapper onClick={() => generateSlug_by_Datetime()}>
        //       <Refresh />
        //     </FieldActionWrapper>
        //   </Stack>
        // }
      />
    </Stack>
  );
};

export default Index;

export const FieldActionWrapper = styled(FieldAction)`
  svg {
    height: 1rem;
    width: 1rem;
    path {
      fill: ${({ theme }) => theme.colors.neutral400};
    }
  }
  svg:hover {
    path {
      fill: ${({ theme }) => theme.colors.primary600};
    }
  }
`;
