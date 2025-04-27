"use strict";
// const plugin = require("../admin/src/pluginId");
// import pluginId from "../admin/src/pluginId";

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: "unique-key",
    plugin: "custom-entity-key",
    pluginId: "custom-entity-key",
    type: "string",
  });
};
