import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, ArrowLeft, ChevronLeft, ChevronRight, Hash } from 'lucide-react';
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

  try {
    [allTags, articlesResult] = await Promise.all([
      getTags(),
      getArticles({
        tag: slug,
        page,
        pageSize
      })
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          홈으로 돌아가기
        </Link>

        <div className="flex items-center space-x-3 mb-4">
          <Hash className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{tag.name}</h1>
          <Badge variant="secondary" className="text-sm">
            {tag.count}개 게시글
          </Badge>
        </div>

        {/* 인기 태그 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">인기 태그</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 10).map((t) => (
              <Link key={t.id} href={`/tag/${t.slug}`}>
                <Badge
                  variant={t.slug === slug ? "default" : "outline"}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  #{t.name}
                  <span className="ml-1 text-xs opacity-70">({t.count})</span>
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
              #{tag.name} 태그 게시글 ({pagination.total}개)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage.url}
                        alt={article.featuredImage.alternativeText || article.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">이미지 없음</span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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

                      <h3 className="text-lg font-bold line-clamp-2">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      <p className="text-muted-foreground line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {article.category && (
                            <Badge variant="outline" className="text-xs">
                              {article.category.name}
                            </Badge>
                          )}
                          {article.tags && article.tags.slice(0, 2).map((t) => (
                            <Badge
                              key={t.id}
                              variant={t.slug === slug ? "default" : "secondary"}
                              className="text-xs"
                            >
                              #{t.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                {Array.from({ length: Math.min(5, pagination.pageCount) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2 + i, pagination.pageCount - 4)) + i;
                  if (pageNum > pagination.pageCount) return null;

                  return (
                    <Link key={pageNum} href={`/tag/${slug}?page=${pageNum}`}>
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
