import { ThemeOptions } from "@mui/material/styles";
import type { Theme } from "@mui/material";
import typography from "./typography";
const shadows = new Array<string>(30)
  .fill("0px 6px 6px 2px rgba(41, 41, 41, 0.04)")
  .map(
    (p, i) => `0px ${6 + 2 * i}px ${6 + 2 * i}px 2px rgba(41, 41, 41, 0.05)`
  );

export const defaultTheme: Partial<ThemeOptions> | any = {
  palette: {
    mode: "light",
    primary: {
      main: "#219ebc",
      contrastText: "rgba(255,255,255,0.87)",
    },
    secondary: {
      main: "#023047",
    },
    background: {
      default: "#f3f7fa",
    },
    // text: {
    //   primary: mainColor.black,
    //   secondary: colorPalette.black["A100"],
    //   disabled: colorPalette.white["A125"],
    // },
    // gray: {
    //   main: colorPalette.white["A100"],
    //   dark: colorPalette.black["A100"],
    // },
    // dustGreen: {
    //   light: colorPalette.dustGreen["A300"],
    //   main: colorPalette.dustGreen["A400"],
    //   dark: colorPalette.dustGreen["A500"],
    // },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1440,
      xxl: 1536,
    },
  },
  typography,
  shadows: ["none", ...shadows],
  overrides: {
    MuiAppBar: {
      colorInherit: {
        backgroundColor: "#689f38",
        color: "#fff",
      },
    },
  },
  props: {
    MuiAppBar: {
      color: "inherit",
    },
    MuiTooltip: {
      arrow: true,
    },
  },
};

export const getRandomColor = () => {
  const colorCollection = [
    "#75ce93",
    "#459bd0",
    "#b4b9d8",
    "#f2998f",
    "#a877e8",
    "#4fb6ac",
  ];
  return colorCollection[Math.floor(Math.random() * colorCollection.length)];
};

declare module "@mui/material" {
  interface Palette {
    gray: Palette["primary"];
    dustGreen: Palette["primary"];
  }

  interface PaletteOptions {
    gray: Palette["primary"];
    dustGreen: Palette["primary"];
  }
  interface LinearProgressPropsColorOverrides {
    dustGreen: true;
    gray: true;
  }
}

export { Theme };
