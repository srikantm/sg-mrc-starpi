import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import { Icon } from "@iconify/react";
import { DownloadDocumentButton } from "./components/DownloadButton";
import { SyncUserButton } from "./components/SyncUserButton";
import { DownloadCSV } from "./components/DownloadCSV";

import React from "react";
// import from ''

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}/report`,
      icon: () => <Icon icon={"teenyicons:area-chart-alt-solid"} />,
      intlLabel: {
        id: `${pluginId}.reports.plugin.name`,
        defaultMessage: "Reports",
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */ "./pages/App"
        );

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.addMenuLink({
      to: `/plugins/${pluginId}/user-wallets`,
      icon: () => <Icon icon="ph:vault-duotone" />,
      intlLabel: {
        id: `${pluginId}.user-vault.plugin.name`,
        defaultMessage: "User Vault",
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */ "./pages/App"
        );

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.injectContentManagerComponent("editView", "right-links", {
      name: "Download",
      Component: DownloadDocumentButton,
    });
    app.injectContentManagerComponent("editView", "right-links", {
      name: "Sync User",
      Component: SyncUserButton,
    });
    app.injectContentManagerComponent("editView", "right-links", {
      name: "Download CSV",
      Component: DownloadCSV,
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
