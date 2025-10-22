import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Eye } from 'lucide-react';
import { Article } from '@/lib/strapi';

interface HeroProps {
  latestArticle?: Article;
}

export function Hero({ latestArticle }: HeroProps) {
  if (!latestArticle) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Crum Blog에 오신 것을 환영합니다</h1>
        <p className="text-xl text-muted-foreground">
          AI 기반 자동화 블로그로 최신 트렌드와 정보를 제공합니다.
        </p>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Article */}
        <Card className="overflow-hidden">
          <div className="relative h-64 lg:h-80">
            {latestArticle.featuredImage ? (
              <Image
                src={latestArticle.featuredImage.url}
                alt={latestArticle.featuredImage.alternativeText || latestArticle.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">이미지 없음</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary">최신</Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(latestArticle.publishedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{latestArticle.viewCount}</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold line-clamp-2">
                <Link 
                  href={`/articles/${latestArticle.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {latestArticle.title}
                </Link>
              </h2>
              
              <p className="text-muted-foreground line-clamp-3">
                {latestArticle.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                {latestArticle.category && (
                  <Badge variant="outline">
                    {latestArticle.category.name}
                  </Badge>
                )}
                <Link 
                  href={`/articles/${latestArticle.slug}`}
                  className="text-primary hover:underline font-medium"
                >
                  자세히 보기 →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Welcome Message */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Crum Blog에 오신 것을 환영합니다
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              AI 기반 자동화 시스템으로 최신 트렌드와 정보를 실시간으로 제공하는 블로그입니다.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>실시간 트렌드 분석</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>AI 기반 콘텐츠 생성</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>SEO 최적화</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>다양한 카테고리</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
