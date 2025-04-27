import {
  createTheme,
  ThemeOptions,
  responsiveFontSizes,
  Theme,
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
} from "@mui/material";

import { DefaultTheme } from "@mui/system";
import { defaultTheme } from "./theme";
import { mergeDeep } from "../utils";
// import React from "react";
// import { StyledEngineProvider } from "@mui/material/styles";
// import createCache from "@emotion/cache";
// import { CacheProvider } from "@emotion/react";

export const createResponsiveTheme = (theme: Partial<ThemeOptions>): Theme => {
  return responsiveFontSizes(createTheme(theme));
};
// function GlobalCssPriority(props: any) {
//   return (
//     <StyledEngineProvider injectFirst>
//       {props.children}
//       {/* Your component tree. Now you can override Material UI's styles. */}
//     </StyledEngineProvider>
//   );
// }

// const cache = createCache({
//   key: "css",
//   prepend: true,
// });

// const PlainCssPriority = (props: any) => {
//   return (
//     <CacheProvider
//       value={createCache({
//         key: "css",
//         prepend: true,
//       })}
//     >
//       {props.children}
//       {/* Your component tree. Now you can override Material UI's styles. */}
//     </CacheProvider>
//   );
// };

type ThemeProviderProp = {
  children?: any;
  theme: DefaultTheme;
};

const getMergedTheme = (theme: Partial<ThemeOptions>) => {
  const mergedTheme = Object.freeze(mergeDeep({}, defaultTheme, theme));
  return createResponsiveTheme(mergedTheme);
};
export const ThemeProvider = (props: ThemeProviderProp) => {
  const { children, theme } = props;
  const themeTemplate = getMergedTheme(theme);

  return (
    <MuiThemeProvider theme={themeTemplate}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {/* <GlobalCssPriority>{children}</GlobalCssPriority> */}
      {/* <PlainCssPriority>{children}</PlainCssPriority> */}
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
