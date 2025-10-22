import { Article } from '@/lib/strapi';

interface ArticleJsonLdProps {
  article: Article;
}

export function ArticleJsonLd({ article }: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: article.featuredImage ? {
      '@type': 'ImageObject',
      url: article.featuredImage.url,
      width: 800,
      height: 600,
      caption: article.featuredImage.alternativeText || article.title
    } : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Crum Blog',
      url: 'https://crum.blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://crum.blog/logo.png'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Crum Blog',
      url: 'https://crum.blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://crum.blog/logo.png',
        width: 200,
        height: 60
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://crum.blog/articles/${article.slug}`,
      url: `https://crum.blog/articles/${article.slug}`
    },
    articleSection: article.category?.name,
    keywords: article.keywords?.join(', '),
    wordCount: article.content.replace(/<[^>]*>/g, '').length,
    inLanguage: 'ko-KR',
    isAccessibleForFree: true,
    genre: article.category?.name,
    about: article.keywords?.map(keyword => ({
      '@type': 'Thing',
      name: keyword
    })),
    mentions: article.tags?.map(tag => ({
      '@type': 'Thing',
      name: tag.name
    })),
    // BreadcrumbList 추가
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: 'https://crum.blog'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: article.category?.name || '카테고리',
          item: `https://crum.blog/category/${article.category?.slug || 'all'}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title,
          item: `https://crum.blog/articles/${article.slug}`
        }
      ]
    },
    // FAQ 스키마 추가 (가상의 FAQ)
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `${article.title}이란 무엇인가요?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: article.excerpt || `${article.title}에 대한 자세한 정보를 제공합니다.`
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
