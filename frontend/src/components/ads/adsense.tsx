'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

export function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  adStyle = { display: 'block' },
  className = '',
  responsive = true 
}: AdSenseProps) {
  const pathname = usePathname();

  useEffect(() => {
    // AdSense 스크립트 로드
    const loadAdSense = () => {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (error) {
          console.error('AdSense 로드 오류:', error);
        }
      }
    };

    // 페이지 변경 시 광고 새로고침
    const timer = setTimeout(loadAdSense, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!adSlot) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// 미리 정의된 광고 컴포넌트들
export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT || ''}
      adFormat="horizontal"
      className={`banner-ad ${className}`}
      adStyle={{ 
        display: 'block',
        width: '100%',
        height: '90px'
      }}
    />
  );
}

export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || ''}
      adFormat="vertical"
      className={`sidebar-ad ${className}`}
      adStyle={{ 
        display: 'block',
        width: '300px',
        height: '250px'
      }}
    />
  );
}

export function InArticleAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_INARTICLE_SLOT || ''}
      adFormat="auto"
      className={`in-article-ad ${className}`}
      adStyle={{ 
        display: 'block',
        textAlign: 'center'
      }}
    />
  );
}

export function MobileAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_MOBILE_SLOT || ''}
      adFormat="auto"
      className={`mobile-ad ${className}`}
      adStyle={{ 
        display: 'block',
        width: '100%',
        height: '50px'
      }}
    />
  );
}

export function RectangleAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_RECTANGLE_SLOT || ''}
      adFormat="rectangle"
      className={`rectangle-ad ${className}`}
      adStyle={{ 
        display: 'block',
        width: '300px',
        height: '250px'
      }}
    />
  );
}
