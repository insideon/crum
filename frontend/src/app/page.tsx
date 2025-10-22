import { Hero } from '@/components/home/hero';
import { ArticleGrid } from '@/components/home/article-grid';
import { CategoryTabs } from '@/components/home/category-tabs';
import { TrendingTags } from '@/components/home/trending-tags';
import { HomePageAds } from '@/components/ads/placement';
import { getArticles, getCategories, getTags } from '@/lib/strapi';

export default async function HomePage() {
  // 데이터 가져오기 (ISR: 5분마다 재생성)
  const [articlesResult, categories, tags] = await Promise.all([
    getArticles({ pageSize: 20 }),
    getCategories(),
    getTags()
  ]);

  const articles = articlesResult.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <Hero latestArticle={articles[0]} />

      {/* 상단 광고 */}
      <HomePageAds />

      {/* Category Tabs */}
      <CategoryTabs categories={categories} />

      {/* Article Grid */}
      <ArticleGrid articles={articles} />

      {/* Trending Tags */}
      <TrendingTags tags={tags.slice(0, 10)} />
    </div>
  );
}

export const revalidate = 300; // 5분마다 재생성
