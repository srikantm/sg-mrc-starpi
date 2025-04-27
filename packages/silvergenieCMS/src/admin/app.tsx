import favicon from "./extensions/favicon.png";
import MenuLogo from "./extensions/icon.svg";
import { LightTheme, DarkTheme } from "./extensions/theme";
export default {
  config: {
    translations: {
      en: {
        "app.components.LeftMenu.navbrand.title": "Silvergenie Workspace",
        "Auth.form.welcome.title": "Welcome to Silvergenie Admin!",
        "Auth.form.welcome.subtitle": "Log in to your Admin Panel!",
      },
    },
    theme: {
      light: LightTheme,
      dark: {},
    },
    head: {
      favicon: favicon,
    },
    auth: {
      logo: MenuLogo,
    },
    menu: {
      logo: MenuLogo,
    },
    // Disable video tutorials
    tutorials: false,
    // Disable notifications about new Strapi releases
    notifications: { releases: false },
  },
  bootstrap() {},
};
