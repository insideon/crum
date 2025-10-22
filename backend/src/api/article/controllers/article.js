const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  // Custom controller methods can be added here
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.entityService.findOne('api::article.article', id, {
      populate: ['category', 'tags', 'featuredImage'],
    });

    // Increment view count
    if (entity) {
      await strapi.entityService.update('api::article.article', id, {
        data: {
          viewCount: (entity.viewCount || 0) + 1,
        },
      });
    }

    return entity;
  },
}));
