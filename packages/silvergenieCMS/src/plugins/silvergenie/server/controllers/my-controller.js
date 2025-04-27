'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('silvergenie')
      .service('myService')
      .getWelcomeMessage();
  },
});
