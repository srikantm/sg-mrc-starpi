export default {
  // // ...
  "custom-entity-key": {
    enabled: true,
    resolve: "./src/plugins/custom-entity-key",
  },
  "import-export-entries": {
    enabled: true,
    config: {
      // See `Config` section.
    },
  },
  // "generate-data": {
  //   enabled: true,
  // },
  "field-nanoid": {
    enabled: true,
  },
  "strapi-advanced-uuid": {
    enabled: true,
  },
  silvergenie: {
    enabled: true,
    resolve: "./src/plugins/silvergenie",
  },
  // // ...
  // slugify: {
  //   enabled: true,
  //   config: {
  //     contentTypes: {
  //       phr: {
  //         field: "enity_key",
  //         references: ["firstName", "email"],
  //       },
  //     },
  //   },
  // },
};
