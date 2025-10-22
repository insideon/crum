'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Eye, ArrowLeft } from 'lucide-react';
import { Article } from '@/lib/strapi';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/articles?filters[$or][0][title][$containsi]=${encodeURIComponent(searchQuery)}&filters[$or][1][content][$containsi]=${encodeURIComponent(searchQuery)}&populate=*&sort=publishedAt:desc&pagination[limit]=20`
      );

      if (!response.ok) {
        throw new Error('검색 요청 실패');
      }

      const data = await response.json();
      setResults(data.data || []);
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

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

        <h1 className="text-3xl font-bold mb-6">검색</h1>

        {/* 검색 폼 */}
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="게시글 제목이나 내용을 검색하세요..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? '검색 중...' : '검색'}
            </Button>
          </div>
        </form>
      </div>

      {/* 검색 결과 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {query && !loading && results.length === 0 && !error && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground mb-4">
            "{query}"에 대한 검색 결과를 찾을 수 없습니다.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>• 다른 키워드로 검색해보세요</p>
            <p>• 철자나 띄어쓰기를 확인해보세요</p>
            <p>• 더 일반적인 용어로 검색해보세요</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              검색 결과 ({results.length}개)
            </h2>
            <p className="text-sm text-muted-foreground">
              "{query}"에 대한 검색 결과
            </p>
          </div>

          <div className="grid gap-6">
            {results.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 이미지 */}
                  <div className="relative h-48 md:h-32">
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

                  {/* 콘텐츠 */}
                  <div className="md:col-span-2 p-6">
                    <div className="space-y-3">
                      {/* 메타 정보 */}
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

                      {/* 제목 */}
                      <h3 className="text-xl font-bold line-clamp-2">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      {/* 요약 */}
                      <p className="text-muted-foreground line-clamp-3">
                        {article.excerpt}
                      </p>

                      {/* 태그 */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {article.category && (
                            <Badge variant="outline">
                              {article.category.name}
                            </Badge>
                          )}
                          {article.tags && article.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag.id} variant="secondary" className="text-xs">
                              #{tag.name}
                            </Badge>
                          ))}
                        </div>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="text-primary hover:underline font-medium text-sm"
                        >
                          자세히 보기 →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 인기 검색어 (선택사항) */}
      {!query && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">인기 검색어</h2>
          <div className="flex flex-wrap gap-2">
            {['인공지능', '스마트폰', '경제', '건강', '여행', '기술', '뉴스', '엔터테인먼트'].map((keyword) => (
              <Button
                key={keyword}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(keyword);
                  handleSearch(keyword);
                }}
                className="hover:bg-primary hover:text-primary-foreground"
              >
                {keyword}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
