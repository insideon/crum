const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::article.article', ({ strapi }) => ({
  // Custom service methods can be added here
  async generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  },

  async createWithSlug(data) {
    const slug = await this.generateSlug(data.title);

    return await strapi.entityService.create('api::article.article', {
      data: {
        ...data,
        slug,
      },
    });
  },
}));
