// .storybook/preview.js

// import {ThemeProvider} from '../src/helpers';
// import {defaultTheme} from '../src/theme/index';
import { createTheme } from "@mui/material/styles";
import React from "react";
import { useMemo } from "react";
import "../src/index.css";
import "@ionic/react/css/core.css";
import { setupIonicReact } from "@ionic/react";
import { defaultTheme } from "../src/theme/theme";
import { ThemeProvider } from "../src/theme/index";

const THEMES = {
  lightTheme: createTheme(defaultTheme),
  darkTheme: createTheme({
    ...defaultTheme,
    palette: {
      mode: "dark",
    },
  }),
};

export const withMuiTheme = (Story, context) => {
  setupIonicReact();
  const { theme: themeKey } = context.globals;

  // only recompute the theme if the themeKey changes
  const theme = useMemo(
    () => THEMES[themeKey] || THEMES["lightTheme"],
    [themeKey]
  );
  console.log(theme, "theme");

  return (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  );
};

export const decorators = [withMuiTheme];

export const globalTypes = {
  theme: {
    name: "Theme",
    title: "Theme",
    description: "Theme for your components",
    defaultValue: "lightTheme",
    toolbar: {
      icon: "paintbrush",
      dynamicTitle: true,
      items: [
        { value: "lightTheme", left: "☀️", title: "Light mode" },
        { value: "darkTheme", left: "🌙", title: "Dark mode" },
      ],
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "IIM_Jobs",
    values: [
      {
        name: "IIM_Jobs",
        value: "#F3F7FA",
      },
      {
        name: "DARK",
        value: "#2E2E2E",
      },
    ],
  },
};
