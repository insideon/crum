import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Eye, Clock, TrendingUp } from 'lucide-react';
import { getArticles } from '@/lib/strapi';

export const metadata: Metadata = {
  title: '모든 게시글 - Crum Blog',
  description: 'Crum Blog의 모든 게시글을 최신순으로 확인하세요.',
};

export default async function ArticlesPage() {
  // 최신 게시글 가져오기
  const articlesResult = await getArticles({ pageSize: 50 });
  const articles = articlesResult.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">모든 게시글</h1>
        <p className="text-muted-foreground">최신순으로 정렬된 모든 게시글</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((article, index) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <Card className="group overflow-hidden hover-lift border-0 shadow-lg bg-gradient-to-br from-card to-card/50 cursor-pointer p-0">
              <div className="relative h-40 overflow-hidden">
                {article.featuredImage ? (
                  <Image
                    src={article.featuredImage.url}
                    alt={article.featuredImage.alternativeText || article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <span className="text-muted-foreground">이미지 없음</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                {/* 카테고리 배지 */}
                {article.category && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-foreground border-0 shadow-sm backdrop-blur-sm">
                      {article.category.name}
                    </Badge>
                  </div>
                )}

                {/* 트렌드 점수 */}
                {article.trendScore && article.trendScore > 80 && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  {/* 메타 정보 */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.viewCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.ceil(Math.random() * 5) + 1}분 읽기</span>
                    </div>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  {/* 요약 */}
                  <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm h-[4.5rem]">
                    {article.excerpt}
                  </p>

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-1">
                    {article.tags && article.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs font-medium">
                        #{tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const revalidate = 300; // 5분마다 재생성
