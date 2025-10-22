"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Article, getPopularArticlesByPeriod } from '@/lib/strapi';
import { PeriodSelector } from '@/components/ui/period-selector';

interface ArticleGridProps {
  initialArticles: Article[];
}

export function ArticleGrid({ initialArticles }: ArticleGridProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArticlesByPeriod = async () => {
      setIsLoading(true);
      try {
        const result = await getPopularArticlesByPeriod(selectedPeriod, { pageSize: 12 });
        setArticles(result.data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticlesByPeriod();
  }, [selectedPeriod]);

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2 gradient-text">인기 게시글</h2>
          </div>
          <div className="flex items-center gap-4">
            <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
            <Link href="/articles">
              <Button variant="outline" size="lg" className="group">
                모든 게시글 보기
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/50 p-0">
              <div className="h-40 bg-muted animate-pulse"></div>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-6 bg-muted animate-pulse rounded"></div>
                  <div className="h-16 bg-muted animate-pulse rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                    <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2 gradient-text">인기 게시글</h2>
          </div>
          <div className="flex items-center gap-4">
            <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
            <Link href="/articles">
              <Button variant="outline" size="lg" className="group">
                모든 게시글 보기
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">게시글이 없습니다</h2>
            <p className="text-muted-foreground">
              선택한 기간에 게시글이 없습니다. 다른 기간을 선택해보세요.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold mb-2 gradient-text">인기 게시글</h2>
        </div>
        <div className="flex items-center gap-4">
          <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
          <Link href="/articles">
            <Button variant="outline" size="lg" className="group">
              모든 게시글 보기
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
                    <span>3분 읽기</span>
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

      {/* 더 많은 콘텐츠 유도 */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-3 rounded-full">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">
            매일 새로운 콘텐츠가 추가됩니다
          </span>
        </div>
      </div>
    </section>
  );
}