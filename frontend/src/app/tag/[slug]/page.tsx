import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, ArrowLeft, ChevronLeft, ChevronRight, Hash, Clock, TrendingUp } from 'lucide-react';
import { getArticles, getTags } from '@/lib/strapi';

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const tags = await getTags();
    const tag = tags.find(t => t.slug === slug);

    if (!tag) {
      return {
        title: '태그를 찾을 수 없습니다',
        description: '요청하신 태그를 찾을 수 없습니다.',
      };
    }

    return {
      title: `#${tag.name} - Crum Blog`,
      description: `${tag.name} 태그가 포함된 게시글을 확인하세요.`,
      keywords: [tag.name, '태그', '블로그', '게시글'],
      openGraph: {
        title: `#${tag.name} - Crum Blog`,
        description: `${tag.name} 태그가 포함된 게시글을 확인하세요.`,
        type: 'website',
      },
    };
  } catch {
    return {
      title: '태그 페이지',
      description: '태그별 게시글을 확인하세요.',
    };
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const pageSize = 12;

  let tag;
  let articlesResult;
  let allTags;
  let allArticlesResult;

  try {
    [allTags, articlesResult, allArticlesResult] = await Promise.all([
      getTags(),
      getArticles({
        tag: slug,
        page,
        pageSize
      }),
      getArticles({ pageSize: 1000 }) // 모든 게시글 가져오기 (조회수 계산용)
    ]);

    tag = allTags.find(t => t.slug === slug);

    if (!tag) {
      notFound();
    }
  } catch {
    notFound();
  }

  const articles = articlesResult.data;
  const pagination = articlesResult.meta.pagination;
  const allArticles = allArticlesResult.data;

  // 태그별 총 조회수 계산
  const tagsWithViewCount = allTags.map(tag => {
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
      {/* 헤더 */}
      <div className="mb-8">
        <Link
          href="/tags"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          모든 태그 보기
        </Link>

        <div className="flex items-center space-x-3 mb-4">
          <Hash className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{tag.name}</h1>
        </div>

        {/* 인기 태그 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">인기 태그</h2>
          <div className="flex flex-wrap gap-2">
            {sortedTagsByViews.slice(0, 10).map((t) => (
              <Link key={t.id} href={`/tag/${t.slug}`}>
                <Badge
                  variant={t.slug === slug ? "default" : "outline"}
                  className={`transition-all duration-300 hover:scale-105 px-4 py-2 ${
                    t.slug === slug
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold"
                      : "hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  #{t.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 게시글 목록 */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏷️</div>
          <h3 className="text-xl font-semibold mb-2">아직 게시글이 없습니다</h3>
          <p className="text-muted-foreground mb-6">
            #{tag.name} 태그가 포함된 게시글이 없습니다.
          </p>
          <Link href="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              #{tag.name} 태그 게시글
            </h2>

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
                          loading={index === 0 ? "eager" : "lazy"}
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
                          {article.tags && article.tags.slice(0, 2).map((t) => (
                            <Badge
                              key={t.id}
                              variant={t.slug === slug ? "default" : "secondary"}
                              className="text-xs font-medium"
                            >
                              #{t.name}
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

          {/* 페이지네이션 */}
          {pagination.pageCount > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              {page > 1 && (
                <Link href={`/tag/${slug}?page=${page - 1}`}>
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    이전
                  </Button>
                </Link>
              )}

              <div className="flex items-center space-x-1">
                {(() => {
                  const pages = [];
                  const maxVisible = 5;

                  if (pagination.pageCount <= maxVisible) {
                    // 총 페이지가 5개 이하면 모든 페이지 표시
                    for (let i = 1; i <= pagination.pageCount; i++) {
                      pages.push(i);
                    }
                  } else {
                    // 현재 페이지를 중심으로 앞뒤 2페이지씩 표시
                    let start = Math.max(1, page - 2);
                    let end = Math.min(pagination.pageCount, page + 2);

                    // 시작이 너무 앞에 있으면 끝을 조정
                    if (end - start < 4) {
                      end = Math.min(pagination.pageCount, start + 4);
                    }

                    // 끝이 너무 뒤에 있으면 시작을 조정
                    if (end - start < 4) {
                      start = Math.max(1, end - 4);
                    }

                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }
                  }

                  return pages.map(pageNum => (
                    <Link key={pageNum} href={`/tag/${slug}?page=${pageNum}`}>
                      <Button
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    </Link>
                  ));
                })()}
              </div>

              {page < pagination.pageCount && (
                <Link href={`/tag/${slug}?page=${page + 1}`}>
                  <Button variant="outline" size="sm">
                    다음
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const tags = await getTags();
    return tags.map(tag => ({
      slug: tag.slug
    }));
  } catch {
    return [];
  }
}
