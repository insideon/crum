import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Eye, ArrowLeft, Clock, TrendingUp } from 'lucide-react';
import { getArticle, getRelatedArticles } from '@/lib/strapi';
import { ArticleJsonLd } from '@/components/article/article-json-ld';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await getArticle(slug);

    return {
      title: article.seoTitle || article.title,
      description: article.metaDescription || article.excerpt,
      keywords: article.keywords,
      authors: [{ name: 'Crum Blog' }],
      openGraph: {
        title: article.title,
        description: article.excerpt,
        url: `https://crum.blog/articles/${article.slug}`,
        siteName: 'Crum Blog',
        images: article.featuredImage ? [{ url: article.featuredImage.url }] : [],
        type: 'article',
        publishedTime: article.publishedAt,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: article.featuredImage ? [article.featuredImage.url] : [],
      },
      alternates: {
        canonical: `https://crum.blog/articles/${article.slug}`,
      }
    };
  } catch {
    return {
      title: '게시글을 찾을 수 없습니다',
      description: '요청하신 게시글을 찾을 수 없습니다.',
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  let article;
  let relatedArticles = [];

  try {
    article = await getArticle(slug);
    relatedArticles = await getRelatedArticles(article.id, 5);
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD Structured Data */}
      <ArticleJsonLd article={article} />

      {/* Back Button */}
      <Link
        href={article.category ? `/category/${article.category.slug}` : "/"}
        className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{article.category ? `${article.category.name} 목록` : "홈으로 돌아가기"}</span>
      </Link>

      <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(article.publishedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{article.viewCount}</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {article.category && (
              <Badge variant="outline">
                {article.category.name}
              </Badge>
            )}
            {article.tags && article.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                #{tag.name}
              </Badge>
            ))}
          </div>

          {article.featuredImage && (
            <div className="relative h-64 md:h-96 mb-8">
              <Image
                src={article.featuredImage.url}
                alt={article.featuredImage.alternativeText || article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="text-sm text-muted-foreground">
            <p>
              이 게시글은 데이터 기반 자동화 시스템으로 생성되었습니다.
            </p>
            {article.sourceKeyword && (
              <p className="mt-2">
                원본 키워드: <span className="font-medium">{article.sourceKeyword}</span>
              </p>
            )}
          </div>
        </footer>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8 gradient-text">관련 게시글</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedArticles.map((relatedArticle, index) => (
              <Link key={relatedArticle.id} href={`/articles/${relatedArticle.slug}`}>
                <Card className="group overflow-hidden hover-lift border-0 shadow-lg bg-gradient-to-br from-card to-card/50 cursor-pointer p-0">
                  <div className="relative h-40 overflow-hidden">
                    {relatedArticle.featuredImage ? (
                      <Image
                        src={relatedArticle.featuredImage.url}
                        alt={relatedArticle.featuredImage.alternativeText || relatedArticle.title}
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
                    {relatedArticle.category && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-foreground border-0 shadow-sm backdrop-blur-sm">
                          {relatedArticle.category.name}
                        </Badge>
                      </div>
                    )}

                    {/* 트렌드 점수 */}
                    {relatedArticle.trendScore && relatedArticle.trendScore > 80 && (
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
                              {new Date(relatedArticle.publishedAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{relatedArticle.viewCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>3분 읽기</span>
                        </div>
                      </div>

                      {/* 제목 */}
                      <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                        {relatedArticle.title}
                      </h3>

                      {/* 요약 */}
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm h-[4.5rem]">
                        {relatedArticle.excerpt}
                      </p>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-1">
                        {relatedArticle.tags && relatedArticle.tags.slice(0, 2).map((tag) => (
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
        </section>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  // 빌드 시 정적 경로 생성 (실제로는 Strapi에서 모든 게시글 가져와야 함)
  return [];
}
