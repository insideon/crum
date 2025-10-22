const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::advertisement.advertisement', {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
