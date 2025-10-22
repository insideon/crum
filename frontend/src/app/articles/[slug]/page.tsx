import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Eye, ArrowLeft, Clock, TrendingUp } from 'lucide-react';
import { getArticle, getRelatedArticles } from '@/lib/strapi';
import { ArticleJsonLd } from '@/components/article/article-json-ld';
import { SocialShare } from '@/components/article/social-share';
import { ReadingProgress } from '@/components/article/reading-progress';

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

      {/* Reading Progress */}
      <ReadingProgress />

      {/* Social Share */}
      <SocialShare title={article.title} url={`https://crum.blog/articles/${article.slug}`} />

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

        {/* Table of Contents */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/70 rounded-full"></div>
            <h3 className="text-lg font-semibold text-foreground">목차</h3>
          </div>
          <nav className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a href="#introduction" className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-sm">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium group-hover:bg-primary group-hover:text-white transition-colors">1</div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">개요</span>
            </a>
            <a href="#key-points" className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-sm">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium group-hover:bg-primary group-hover:text-white transition-colors">2</div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">핵심 포인트</span>
            </a>
            <a href="#conclusion" className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-sm">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium group-hover:bg-primary group-hover:text-white transition-colors">3</div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">결론</span>
            </a>
          </nav>
        </div>

        {/* Introduction Section */}
        <section id="introduction" className="space-y-6 mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-foreground">개요</h2>
          </div>
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {article.excerpt || `${article.title}에 대한 종합적인 분석과 최신 정보를 제공합니다.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section id="main-content" className="mb-12">
          <div
            className={`
              [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:text-foreground [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:leading-tight
              [&_h1]:bg-gradient-to-r [&_h1]:from-primary [&_h1]:to-primary/80 [&_h1]:bg-clip-text [&_h1]:text-transparent

              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:leading-snug
              [&_h2]:pl-4 [&_h2]:relative [&_h2]:before:content-[''] [&_h2]:before:absolute [&_h2]:before:left-0
              [&_h2]:before:top-1/2 [&_h2]:before:-translate-y-1/2 [&_h2]:before:w-1 [&_h2]:before:h-3/5
              [&_h2]:before:bg-gradient-to-b [&_h2]:before:from-primary [&_h2]:before:to-primary/60 [&_h2]:before:rounded-sm

              [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:leading-snug
              [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:leading-snug

              [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p]:mb-6 [&_p]:text-justify

              [&_ul]:my-6 [&_ul]:pl-6 [&_ul]:space-y-2
              [&_ol]:my-6 [&_ol]:pl-6 [&_ol]:space-y-2
              [&_li]:text-base [&_li]:leading-relaxed [&_li]:text-muted-foreground
              [&_ul_li]:marker:text-primary [&_ul_li]:marker:text-lg
              [&_ol_li]:marker:text-primary [&_ol_li]:marker:font-semibold

              [&_strong]:font-bold [&_strong]:text-foreground [&_strong]:bg-primary/10
              [&_strong]:px-1 [&_strong]:py-0.5 [&_strong]:rounded

              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-gradient-to-r
              [&_blockquote]:from-muted/30 [&_blockquote]:to-muted/10 [&_blockquote]:py-6 [&_blockquote]:px-8
              [&_blockquote]:my-8 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:relative
              [&_blockquote]:before:content-['"'] [&_blockquote]:before:absolute [&_blockquote]:before:-top-2
              [&_blockquote]:before:left-4 [&_blockquote]:before:text-6xl [&_blockquote]:before:text-primary/30
              [&_blockquote]:before:font-serif

              [&_blockquote_p]:m-0 [&_blockquote_p]:text-lg [&_blockquote_p]:text-foreground

              [&_a]:text-primary [&_a]:font-medium [&_a]:border-b-2 [&_a]:border-transparent
              [&_a]:transition-all [&_a]:duration-200 [&_a]:hover:border-primary [&_a]:hover:bg-primary/10
              [&_a]:hover:px-1 [&_a]:hover:py-0.5 [&_a]:hover:rounded

              max-w-none
            `}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </section>

        {/* Key Points */}
        <section id="key-points" className="space-y-6 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-foreground">핵심 포인트</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {article.keywords?.slice(0, 4).map((keyword, index) => (
              <div key={index} className="group bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 transition-colors">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-2">{keyword}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {keyword}에 대한 중요한 정보와 인사이트를 제공합니다.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Topics */}
        <section className="space-y-6 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-foreground">관련 주제</h2>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50">
            <div className="flex flex-wrap gap-3">
              {article.tags?.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="group inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                >
                  <span className="mr-2">#</span>
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion" className="space-y-6 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-foreground">결론</h2>
          </div>
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-8 border border-green-200/50 dark:border-green-800/50 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {article.title}에 대한 분석을 통해 중요한 인사이트를 얻을 수 있었습니다.
                  앞으로도 관련 분야의 최신 동향을 지속적으로 모니터링하여 유용한 정보를 제공하겠습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold gradient-text">관련 게시글</h2>
            <Link
              href={article.category ? `/category/${article.category.slug}` : "/"}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              더보기 →
            </Link>
          </div>

          {/* Internal Links Section */}
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold mb-4 text-foreground">추천 읽을거리</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.slice(0, 2).map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/articles/${relatedArticle.slug}`}
                  className="group block p-4 bg-white dark:bg-card rounded-lg border hover:shadow-md transition-all duration-200 hover:border-primary/50"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                        <span>{relatedArticle.category?.name}</span>
                        <span>•</span>
                        <span>{new Date(relatedArticle.publishedAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

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
