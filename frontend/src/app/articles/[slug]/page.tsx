import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Eye, ArrowLeft } from 'lucide-react';
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
        href="/"
        className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>홈으로 돌아가기</span>
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
              <span>{article.viewCount} 조회</span>
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
              이 게시글은 AI 기반 자동화 시스템으로 생성되었습니다.
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
          <h2 className="text-2xl font-bold mb-8">관련 게시글</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Card key={relatedArticle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  {relatedArticle.featuredImage ? (
                    <Image
                      src={relatedArticle.featuredImage.url}
                      alt={relatedArticle.featuredImage.alternativeText || relatedArticle.title}
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
                  <h3 className="text-lg font-bold line-clamp-2 mb-2">
                    <Link
                      href={`/articles/${relatedArticle.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {relatedArticle.title}
                    </Link>
                  </h3>

                  <p className="text-muted-foreground line-clamp-3 text-sm">
                    {relatedArticle.excerpt}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    {relatedArticle.category && (
                      <Badge variant="outline" className="text-xs">
                        {relatedArticle.category.name}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(relatedArticle.publishedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
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
