import { Article } from '@/lib/strapi';

interface ArticleJsonLdProps {
  article: Article;
}

export function ArticleJsonLd({ article }: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage?.url,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Crum Blog'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Crum Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://crum.blog/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://crum.blog/articles/${article.slug}`
    },
    articleSection: article.category?.name,
    keywords: article.keywords?.join(', '),
    wordCount: article.content.length,
    inLanguage: 'ko-KR'
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
