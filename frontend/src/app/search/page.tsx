'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Eye, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/lib/strapi';
import { getArticles } from '@/lib/strapi';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  const handleSearch = useCallback(async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 환경에 따라 다른 검색 방식 사용
      const useDummyData = process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

      if (useDummyData) {
        // 더미 데이터를 사용하여 검색
        const articlesResult = await getArticles({ pageSize: 1000 });
        const allArticles = articlesResult.data;

        // 클라이언트 사이드에서 검색 필터링
        const filteredResults = allArticles.filter(article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // 페이지네이션 적용
        const totalResults = filteredResults.length;
        const totalPagesCount = Math.ceil(totalResults / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedResults = filteredResults.slice(startIndex, endIndex);

        setResults(paginatedResults);
        setTotalPages(totalPagesCount);
        setCurrentPage(page);
      } else {
        // Strapi API를 사용하여 검색
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/articles?filters[$or][0][title][$containsi]=${encodeURIComponent(searchQuery)}&filters[$or][1][content][$containsi]=${encodeURIComponent(searchQuery)}&populate=*&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
        );

        if (!response.ok) {
          throw new Error('검색 요청 실패');
        }

        const data = await response.json();
        setResults(data.data || []);
        setTotalPages(data.meta?.pagination?.pageCount || 1);
        setCurrentPage(page);
      }
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // searchParams가 변경될 때마다 query 상태 업데이트
  useEffect(() => {
    const newQuery = searchParams.get('q') || '';
    setQuery(newQuery);
  }, [searchParams]);

  // query가 변경될 때마다 검색 실행
  useEffect(() => {
    if (query) {
      setCurrentPage(1);
      handleSearch(query, 1);
    }
  }, [query, handleSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    handleSearch(query, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch(query, page);
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
              검색 결과
            </h2>
            <p className="text-sm text-muted-foreground">
              "{query}"에 대한 검색 결과 (페이지 {currentPage}/{totalPages})
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((article, index) => (
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
                          <span>3분 읽기</span>
                        </div>
                      </div>

                      {/* 제목 */}
                      <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>

                      {/* 요약 */}
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm h-18">
                        {article.excerpt}
                      </p>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-1">
                        {article.tags && article.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs font-medium"
                          >
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

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              {currentPage > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  이전
                </Button>
              )}

              <div className="flex items-center space-x-1">
                {(() => {
                  const pages = [];
                  const maxVisible = 5;

                  if (totalPages <= maxVisible) {
                    // 총 페이지가 5개 이하면 모든 페이지 표시
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // 현재 페이지를 중심으로 앞뒤 2페이지씩 표시
                    let start = Math.max(1, currentPage - 2);
                    let end = Math.min(totalPages, currentPage + 2);

                    // 시작이 너무 앞에 있으면 끝을 조정
                    if (end - start < 4) {
                      end = Math.min(totalPages, start + 4);
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
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      className="w-10"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ));
                })()}
              </div>

              {currentPage < totalPages && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  다음
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          )}
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
                  setCurrentPage(1);
                  handleSearch(keyword, 1);
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
