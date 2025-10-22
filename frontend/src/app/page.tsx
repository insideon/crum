import { ArticleGrid } from '@/components/home/article-grid';
import { CategoryTabs } from '@/components/home/category-tabs';
import { TrendingTags } from '@/components/home/trending-tags';
import { getPopularArticlesByPeriod, getCategories, getTags, getArticles } from '@/lib/strapi';

export default async function HomePage() {
  // 데이터 가져오기 (ISR: 5분마다 재생성)
  const [articlesResult, categories, tags, allArticlesResult] = await Promise.all([
    getPopularArticlesByPeriod('week', { pageSize: 12 }), // 기본값: 이번 주
    getCategories(),
    getTags(),
    getArticles({ pageSize: 1000 }) // 모든 게시글 가져오기 (조회수 계산용)
  ]);

  const articles = articlesResult.data;
  const allArticles = allArticlesResult.data;

  // 태그별 총 조회수 계산
  const tagsWithViewCount = tags.map(tag => {
    const totalViews = allArticles
      .filter(article => article.tags?.some(t => t.slug === tag.slug))
      .reduce((sum, article) => sum + article.viewCount, 0);

    return {
      ...tag,
      totalViews
    };
  });

  // 조회수 기준으로 정렬 (내림차순)
  const sortedTagsByViews = tagsWithViewCount.sort((a, b) => b.totalViews - a.totalViews);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Article Grid - 기간별 필터링이 가능한 인기 게시글 */}
      <ArticleGrid initialArticles={articles} />

      {/* Category Tabs */}
      <CategoryTabs categories={categories} />

      {/* Trending Tags */}
      <TrendingTags tags={sortedTagsByViews.slice(0, 10)} />
    </div>
  );
}

export const revalidate = 300; // 5분마다 재생성
