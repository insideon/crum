import { ArticleGrid } from '@/components/home/article-grid';
import { CategoryTabs } from '@/components/home/category-tabs';
import { TrendingTags } from '@/components/home/trending-tags';
import { getPopularArticlesByPeriod, getCategories, getTags } from '@/lib/strapi';

export default async function HomePage() {
  // 데이터 가져오기 (ISR: 5분마다 재생성)
  const [articlesResult, categories, tags] = await Promise.all([
    getPopularArticlesByPeriod('week', { pageSize: 12 }), // 기본값: 이번 주
    getCategories(),
    getTags()
  ]);

  const articles = articlesResult.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Article Grid - 기간별 필터링이 가능한 인기 게시글 */}
      <ArticleGrid initialArticles={articles} />

      {/* Category Tabs */}
      <CategoryTabs categories={categories} />

      {/* Trending Tags */}
      <TrendingTags tags={tags.slice(0, 10)} />
    </div>
  );
}

export const revalidate = 300; // 5분마다 재생성
