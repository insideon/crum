const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::site-config.site-config', {
  config: {
    find: {
      auth: false,
    },
  },
});
