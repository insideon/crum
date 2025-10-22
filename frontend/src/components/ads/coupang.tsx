'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingCart, Star, TrendingUp } from 'lucide-react';

interface CoupangProduct {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  discountRate?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  categoryName?: string;
  brand?: string;
  isRocketDelivery?: boolean;
  isRocketFresh?: boolean;
}

interface CoupangProductsProps {
  keyword: string;
  category?: string;
  limit?: number;
  className?: string;
}

export function CoupangProducts({
  keyword,
  category,
  limit = 4,
  className = ''
}: CoupangProductsProps) {
  const [products, setProducts] = useState<CoupangProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (keyword) {
      fetchProducts();
    }
  }, [keyword, category]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        keyword,
        limit: limit.toString(),
        ...(category && { category })
      });

      const response = await fetch(`/api/coupang/products?${params}`);

      if (!response.ok) {
        throw new Error('상품 조회 실패');
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError('상품을 불러오는데 실패했습니다.');
      console.error('Coupang API 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`coupang-products ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`coupang-products ${className}`}>
        <div className="text-center py-8">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`coupang-products ${className}`}>
        <div className="text-center py-8">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">관련 상품을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`coupang-products ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          "{keyword}" 관련 추천 상품
        </h3>
        <p className="text-sm text-muted-foreground">
          쿠팡에서 검증된 상품들을 확인해보세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.productId} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={product.productImage}
                alt={product.productName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />

              {/* 배송 배지 */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isRocketDelivery && (
                  <Badge variant="destructive" className="text-xs">
                    로켓배송
                  </Badge>
                )}
                {product.isRocketFresh && (
                  <Badge variant="secondary" className="text-xs">
                    로켓프레시
                  </Badge>
                )}
              </div>

              {/* 할인율 */}
              {product.discountRate && product.discountRate > 0 && (
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="text-xs">
                    {product.discountRate}% 할인
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                {/* 브랜드 */}
                {product.brand && (
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                )}

                {/* 상품명 */}
                <h4 className="text-sm font-medium line-clamp-2 leading-tight">
                  {product.productName}
                </h4>

                {/* 평점 */}
                {product.rating && product.reviewCount && (
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                    <span>({product.reviewCount.toLocaleString()})</span>
                  </div>
                )}

                {/* 가격 */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">
                      {product.productPrice.toLocaleString()}원
                    </span>
                    {product.originalPrice && product.originalPrice > product.productPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                    )}
                  </div>
                </div>

                {/* 카테고리 */}
                {product.categoryName && (
                  <Badge variant="outline" className="text-xs">
                    {product.categoryName}
                  </Badge>
                )}

                {/* 쿠팡 링크 */}
                <Link
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    쿠팡에서 보기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 쿠팡 파트너스 고지 */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          본 포스팅은 쿠팡 파트너스 활동을 통해 일정액의 수수료를 제공받습니다.
        </p>
      </div>
    </div>
  );
}

// 특정 카테고리별 상품 추천 컴포넌트
export function CategoryProducts({
  category,
  limit = 6,
  className = ''
}: {
  category: string;
  limit?: number;
  className?: string;
}) {
  const categoryKeywords: Record<string, string> = {
    'tech': '스마트폰',
    'lifestyle': '생활용품',
    'health': '건강',
    'food': '요리',
    'travel': '여행',
    'entertainment': '엔터테인먼트'
  };

  const keyword = categoryKeywords[category] || category;

  return (
    <CoupangProducts
      keyword={keyword}
      category={category}
      limit={limit}
      className={className}
    />
  );
}

// 인기 상품 컴포넌트
export function PopularProducts({ className = '' }: { className?: string }) {
  return (
    <CoupangProducts
      keyword="인기상품"
      limit={8}
      className={className}
    />
  );
}
