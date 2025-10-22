import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, ChevronLeft, ChevronRight, Clock, TrendingUp } from 'lucide-react';
import { getArticles, getCategories } from '@/lib/strapi';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const categories = await getCategories();
    const category = categories.find(cat => cat.slug === slug);

    if (!category) {
      return {
        title: '카테고리를 찾을 수 없습니다',
        description: '요청하신 카테고리를 찾을 수 없습니다.',
      };
    }

    return {
      title: `${category.name} - Crum Blog`,
      description: category.description || `${category.name} 관련 최신 게시글을 확인하세요.`,
      keywords: [category.name, '블로그', '게시글'],
      openGraph: {
        title: `${category.name} - Crum Blog`,
        description: category.description || `${category.name} 관련 최신 게시글을 확인하세요.`,
        type: 'website',
      },
    };
  } catch {
    return {
      title: '카테고리 페이지',
      description: '카테고리별 게시글을 확인하세요.',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const pageSize = 12;

  let category;
  let articlesResult;
  let allCategories;

  try {
    [allCategories, articlesResult] = await Promise.all([
      getCategories(),
      getArticles({
        category: slug,
        page,
        pageSize
      })
    ]);

    category = allCategories.find(cat => cat.slug === slug);

    if (!category) {
      notFound();
    }
  } catch {
    notFound();
  }

  const articles = articlesResult.data;
  const pagination = articlesResult.meta.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          {category.icon && <span className="text-3xl">{category.icon}</span>}
          <h1 className="text-4xl font-bold gradient-text">{category.name}</h1>
        </div>
      </div>

      {/* 게시글 목록 */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">아직 게시글이 없습니다</h3>
          <p className="text-muted-foreground mb-6">
            {category.name} 카테고리에 게시글이 없습니다.
          </p>
          <Link href="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article) => (
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
          </div>

          {/* 페이지네이션 */}
          {pagination.pageCount > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              {page > 1 && (
                <Link href={`/category/${slug}?page=${page - 1}`}>
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    이전
                  </Button>
                </Link>
              )}

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.pageCount) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2 + i, pagination.pageCount - 4)) + i;
                  if (pageNum > pagination.pageCount) return null;

                  return (
                    <Link key={pageNum} href={`/category/${slug}?page=${pageNum}`}>
                      <Button
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {page < pagination.pageCount && (
                <Link href={`/category/${slug}?page=${page + 1}`}>
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
    const categories = await getCategories();
    return categories.map(category => ({
      slug: category.slug
    }));
  } catch {
    return [];
  }
}
