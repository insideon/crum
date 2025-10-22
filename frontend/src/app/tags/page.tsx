import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hash, TrendingUp, ArrowRight, Eye } from 'lucide-react';
import { getTags, getArticles } from '@/lib/strapi';

export const metadata: Metadata = {
  title: '모든 태그 - Crum Blog',
  description: 'Crum Blog의 모든 태그를 확인하고 관심 있는 주제의 게시글을 찾아보세요.',
};

export default async function TagsPage() {
  const [tags, allArticlesResult] = await Promise.all([
    getTags(),
    getArticles({ pageSize: 1000 }) // 모든 게시글 가져오기 (조회수 계산용)
  ]);

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
  const sortedTags = tagsWithViewCount.sort((a, b) => b.totalViews - a.totalViews);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold mb-2 gradient-text">모든 태그</h2>
          <p className="text-muted-foreground">관심 있는 주제의 태그를 찾아보세요</p>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">인기 태그</span>
        </div>
      </div>

      {/* 태그 통계 */}
      <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{tags.length}</div>
            <div className="text-sm text-muted-foreground">전체 태그</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {allArticles.length}
            </div>
            <div className="text-sm text-muted-foreground">총 게시글</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {Math.round(sortedTags.reduce((sum, tag) => sum + tag.totalViews, 0) / sortedTags.length).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">평균 조회수</div>
          </div>
        </div>
      </div>

      {/* 인기 태그 */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 gradient-text">인기 태그</h3>
        <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 p-6">
          <div className="flex flex-wrap gap-3">
            {sortedTags.slice(0, 20).map((tag, index) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`}>
                <Badge className={`group cursor-pointer transition-all duration-300 hover:scale-105 px-4 py-2 text-sm font-medium ${
                  index < 3
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70"
                    : "bg-gradient-to-r from-muted to-muted/80 text-muted-foreground hover:from-primary/90 hover:to-primary/70 hover:text-primary-foreground"
                }`}>
                  <Hash className="h-3 w-3 mr-1" />
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 모든 태그 */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 gradient-text">전체 태그</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {sortedTags.map((tag) => (
            <Link key={tag.id} href={`/tag/${tag.slug}`}>
              <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift">
                <div className="p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Hash className="h-4 w-4 text-primary" />
                  </div>

                  <h4 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {tag.name}
                  </h4>

                  <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{tag.totalViews.toLocaleString()}</span>
                  </div>
                </div>

                {/* 호버 효과 */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 빠른 탐색 */}
      <div className="text-center">
        <Link href="/">
          <Button variant="outline" size="lg" className="group">
            홈으로 돌아가기
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export const revalidate = 300; // 5분마다 재생성
