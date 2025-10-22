'use client';

import { AdSense, BannerAd, SidebarAd, InArticleAd, MobileAd } from './adsense';
import { CoupangProducts, CategoryProducts } from './coupang';
import { Card, CardContent } from '@/components/ui/card';

interface AdPlacementProps {
  type: 'banner' | 'sidebar' | 'in-article' | 'mobile' | 'coupang' | 'category-products';
  position?: 'top' | 'middle' | 'bottom' | 'sidebar';
  keyword?: string;
  category?: string;
  className?: string;
}

export function AdPlacement({ 
  type, 
  position = 'middle', 
  keyword, 
  category, 
  className = '' 
}: AdPlacementProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // 모바일에서는 특정 광고만 표시
  if (isMobile && !['mobile', 'banner', 'coupang'].includes(type)) {
    return null;
  }

  const renderAd = () => {
    switch (type) {
      case 'banner':
        return <BannerAd className={className} />;
      
      case 'sidebar':
        return <SidebarAd className={className} />;
      
      case 'in-article':
        return <InArticleAd className={className} />;
      
      case 'mobile':
        return <MobileAd className={className} />;
      
      case 'coupang':
        return keyword ? (
          <CoupangProducts 
            keyword={keyword} 
            className={className} 
          />
        ) : null;
      
      case 'category-products':
        return category ? (
          <CategoryProducts 
            category={category} 
            className={className} 
          />
        ) : null;
      
      default:
        return null;
    }
  };

  const ad = renderAd();
  
  if (!ad) {
    return null;
  }

  return (
    <div className={`ad-placement ad-placement--${type} ad-placement--${position} ${className}`}>
      {ad}
    </div>
  );
}

// 페이지별 광고 배치 컴포넌트들
export function HomePageAds() {
  return (
    <div className="space-y-6">
      {/* 상단 배너 */}
      <AdPlacement type="banner" position="top" />
      
      {/* 중간 쿠팡 상품 */}
      <AdPlacement type="coupang" keyword="인기상품" position="middle" />
      
      {/* 하단 배너 */}
      <AdPlacement type="banner" position="bottom" />
    </div>
  );
}

export function ArticlePageAds({ keyword, category }: { keyword?: string; category?: string }) {
  return (
    <div className="space-y-6">
      {/* 상단 배너 */}
      <AdPlacement type="banner" position="top" />
      
      {/* 기사 중간 광고 */}
      <AdPlacement type="in-article" position="middle" />
      
      {/* 관련 상품 */}
      {keyword && (
        <AdPlacement 
          type="coupang" 
          keyword={keyword} 
          position="middle" 
        />
      )}
      
      {/* 하단 배너 */}
      <AdPlacement type="banner" position="bottom" />
    </div>
  );
}

export function CategoryPageAds({ category }: { category: string }) {
  return (
    <div className="space-y-6">
      {/* 상단 배너 */}
      <AdPlacement type="banner" position="top" />
      
      {/* 카테고리별 상품 */}
      <AdPlacement 
        type="category-products" 
        category={category} 
        position="middle" 
      />
      
      {/* 하단 배너 */}
      <AdPlacement type="banner" position="bottom" />
    </div>
  );
}

export function SidebarAds() {
  return (
    <div className="space-y-4">
      {/* 사이드바 광고 */}
      <AdPlacement type="sidebar" position="sidebar" />
      
      {/* 쿠팡 인기 상품 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">인기 상품</h3>
          <AdPlacement 
            type="coupang" 
            keyword="인기상품" 
            position="sidebar" 
          />
        </CardContent>
      </Card>
    </div>
  );
}

// 광고 통계 컴포넌트 (관리자용)
export function AdStats() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">광고 수익 통계</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">₩1,234,567</div>
            <div className="text-sm text-muted-foreground">이번 달 수익</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₩98,765</div>
            <div className="text-sm text-muted-foreground">어제 수익</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12.5%</div>
            <div className="text-sm text-muted-foreground">CTR</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">₩1,234</div>
            <div className="text-sm text-muted-foreground">eCPM</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
