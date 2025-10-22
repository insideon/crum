/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://crum.blog',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/_next/', '/static/']
      }
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://crum.blog'}/sitemap.xml`
    ]
  },
  exclude: [
    '/admin/*',
    '/api/*',
    '/_next/*',
    '/static/*'
  ],
  additionalPaths: async (config) => {
    const paths = [];

    try {
      // Strapi에서 동적으로 게시글 목록 가져오기
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/articles?pagination[limit]=1000&fields[0]=slug&fields[1]=updatedAt`);

      if (response.ok) {
        const data = await response.json();
        const articles = data.data || [];

        articles.forEach(article => {
          paths.push({
            loc: `/articles/${article.slug}`,
            lastmod: article.updatedAt,
            priority: 0.8,
            changefreq: 'daily'
          });
        });
      }
    } catch (error) {
      console.error('Sitemap 생성 중 오류:', error);
    }

    // 카테고리 페이지 추가
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/categories?fields[0]=slug&fields[1]=updatedAt`);

      if (response.ok) {
        const data = await response.json();
        const categories = data.data || [];

        categories.forEach(category => {
          paths.push({
            loc: `/category/${category.slug}`,
            lastmod: category.updatedAt,
            priority: 0.7,
            changefreq: 'weekly'
          });
        });
      }
    } catch (error) {
      console.error('카테고리 Sitemap 생성 중 오류:', error);
    }

    // 태그 페이지 추가
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/tags?fields[0]=slug&fields[1]=updatedAt`);

      if (response.ok) {
        const data = await response.json();
        const tags = data.data || [];

        tags.forEach(tag => {
          paths.push({
            loc: `/tag/${tag.slug}`,
            lastmod: tag.updatedAt,
            priority: 0.6,
            changefreq: 'weekly'
          });
        });
      }
    } catch (error) {
      console.error('태그 Sitemap 생성 중 오류:', error);
    }

    return paths;
  },
  transform: async (config, path) => {
    // 기본 변환 설정
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  }
};
