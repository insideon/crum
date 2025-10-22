# Product Requirements Document (PRD)

## Project Overview

### Product Name
**Crum Blog** (crum.blog)

### Vision
AI 기반 자동 콘텐츠 생성과 트렌드 분석을 통해 최신 이슈와 정보를 제공하는 자동화 블로그 미디어 사이트

### Product Type
**단일 자동화 블로그 사이트** (블로그 플랫폼이 아님)
- 운영자 1명 (관리자)
- 방문자는 콘텐츠를 읽기만 함
- 콘텐츠는 자동으로 생성되어 발행됨

### Target Audience
- 최신 트렌드와 이슈에 관심 있는 일반 대중
- 검색 엔진을 통해 정보를 찾는 사용자
- 특정 키워드 검색 후 유입되는 방문자
- 모바일/데스크톱 사용자 모두

### Business Model
광고 및 제휴 마케팅 기반 수익 창출
- Google AdSense (디스플레이 광고)
- 쿠팡 파트너스 (제휴 링크)

---

## Core Features

### 1. 트렌드 데이터 자동 수집 시스템

#### 1.1 데이터 소스
**Google Trends API**
- 실시간 인기 검색어 수집 (한국)
- 카테고리별 트렌드 분석
- 급상승 키워드 추출
- 검색량 데이터 수집

**웹 크롤링**
- 네이버 실시간 검색어 (가능 시)
- 주요 포털 뉴스 헤드라인
- SNS 트렌딩 해시태그 (Twitter/X API)
- Google 검색 자동완성 키워드

#### 1.2 키워드 처리 로직
```
원본 키워드 수집
  ↓
중복 제거 및 정규화
  ↓
카테고리 자동 분류 (LLM 활용)
  ↓
트렌드 점수 계산 (검색량 × 급상승률 × 신선도)
  ↓
이미 작성된 주제 필터링 (Strapi DB 조회)
  ↓
우선순위 정렬
  ↓
상위 N개 키워드 선정
```

#### 1.3 카테고리 분류
- 뉴스/시사
- 엔터테인먼트/연예
- 기술/IT
- 생활/건강
- 경제/재테크
- 요리/맛집
- 여행/문화
- 스포츠
- 교육
- 기타

### 2. AI 콘텐츠 자동 생성 시스템

#### 2.1 LLM API 통합
**Primary Option**
- OpenAI GPT-4o-mini (비용 효율적)
- GPT-4 (고품질 콘텐츠 필요 시)

**Alternative Options**
- Anthropic Claude 3.5 Sonnet
- Google Gemini Pro

**비용 최적화 전략**
- GPT-4o-mini를 기본으로 사용 (저렴)
- 중요 키워드만 GPT-4 사용
- 일일 토큰 사용량 제한 설정
- 프롬프트 최적화로 토큰 절약

#### 2.2 콘텐츠 생성 파이프라인

**Step 1: 주제 리서치**
```javascript
// 선정된 키워드로 추가 정보 수집
- Google Search API로 관련 뉴스/정보 검색
- 상위 5개 결과 요약 추출
- 관련 키워드 수집
- 최신 정보 시간순 정렬
```

**Step 2: 콘텐츠 생성 (LLM API 호출)**
```javascript
// 프롬프트 구조
{
  role: "system",
  content: "당신은 SEO 최적화된 블로그 글을 작성하는 전문 작가입니다..."
}

{
  role: "user",
  content: `
    주제: ${keyword}
    카테고리: ${category}
    참고 정보: ${researchData}

    요구사항:
    1. SEO 최적화된 제목 생성 (60자 이내, 키워드 포함)
    2. 본문 1,500자 이상 작성
    3. H2, H3 소제목 구조화
    4. 자연스러운 키워드 배치 (밀도 2-3%)
    5. 마지막에 결론 섹션 포함

    출력 형식: JSON
    {
      "title": "...",
      "content": "...", // Markdown 형식
      "excerpt": "...", // 150자 이내 요약
      "seoTitle": "...",
      "metaDescription": "...",
      "tags": ["...", "..."]
    }
  `
}
```

**Step 3: SEO 최적화 처리**
```javascript
// 자동 처리 항목
- Slug 생성 (제목 → URL friendly)
- 메타 태그 생성
- Open Graph 이미지 URL 설정
- Schema.org Article 구조화 데이터
- 내부 링크 자동 삽입 (관련 글 3-5개)
- 이미지 alt 텍스트 생성
- 키워드 태그 추출
```

**Step 4: 품질 검증**
```javascript
// 자동 검증 로직
✓ 최소 길이 확인 (1,000자 이상)
✓ 제목 길이 확인 (10-60자)
✓ 금칙어 필터링 (욕설, 비방, 민감 주제)
✓ 중복 콘텐츠 체크 (기존 글과 유사도 < 80%)
✓ 키워드 밀도 확인 (2-4% 범위)

// 통과 시 → Strapi 저장
// 실패 시 → 재생성 또는 로그 기록
```

**Step 5: Strapi CMS 저장 및 발행**
```javascript
// Strapi API 호출
POST /api/articles
{
  title, slug, content, excerpt,
  category, tags,
  seoTitle, metaDescription,
  featuredImage, // Unsplash API 또는 AI 생성 이미지
  sourceKeyword,
  trendScore,
  status: "published",
  publishedAt: new Date()
}
```

#### 2.3 이미지 처리
**Featured Image 소싱**
- Unsplash API (무료, 고품질)
- Pexels API (무료 대체)
- Stable Diffusion API (AI 생성, 비용 발생)

**이미지 최적화**
- WebP 변환
- 리사이징 (최대 1200px 너비)
- Lazy loading
- CDN 업로드 (Cloudinary)

### 3. Strapi CMS 구조

#### 3.1 Content Types

**Article (단일 타입)**
```typescript
interface Article {
  id: number;
  documentId: string;
  title: string; // 제목
  slug: string; // URL 슬러그 (자동 생성)
  content: string; // 본문 (Markdown/RichText)
  excerpt: string; // 요약 (메타 설명용)

  // Relations
  category: Relation<Category>;
  tags: Relation<Tag[]>;

  // SEO
  seoTitle: string;
  metaDescription: string;
  keywords: string[]; // JSON 배열

  // Media
  featuredImage: Media;

  // Metadata
  sourceKeyword: string; // 원본 트렌드 키워드
  trendScore: number; // 트렌드 점수
  viewCount: number; // 조회수

  // Status
  status: 'draft' | 'published' | 'archived';
  publishedAt: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

**Category (컬렉션 타입)**
```typescript
interface Category {
  id: number;
  name: string; // "뉴스/시사"
  slug: string; // "news"
  description: string;
  icon: string; // 이모지 또는 아이콘 클래스
  articles: Relation<Article[]>;
  order: number; // 표시 순서
}
```

**Tag (컬렉션 타입)**
```typescript
interface Tag {
  id: number;
  name: string; // "인공지능"
  slug: string; // "ai"
  articles: Relation<Article[]>;
  count: number; // 사용 횟수 (자동 계산)
}
```

**Advertisement (단일 타입)**
```typescript
interface Advertisement {
  id: number;

  // Google AdSense
  adsenseEnabled: boolean;
  adsenseClientId: string; // ca-pub-xxxxx
  adsenseSlots: {
    header: string; // 슬롯 ID
    sidebar: string;
    inContent: string;
    footer: string;
  };

  // Coupang Partners
  coupangEnabled: boolean;
  coupangAccessKey: string;
  coupangSecretKey: string;
  coupangTrackingId: string;

  // Settings
  adDensity: 'low' | 'medium' | 'high';
  showAdOnMobile: boolean;
}
```

**SiteConfig (단일 타입)**
```typescript
interface SiteConfig {
  siteName: string; // "Crum Blog"
  siteDescription: string;
  siteUrl: string; // "https://crum.blog"
  logoUrl: string;
  faviconUrl: string;

  // SEO
  defaultOgImage: string;
  googleAnalyticsId: string; // GA4
  googleSearchConsoleId: string;

  // Social
  twitterHandle: string;

  // Automation
  automationEnabled: boolean;
  articlesPerDay: number; // 목표 게시글 수
  minTrendScore: number; // 최소 트렌드 점수
}
```

#### 3.2 Strapi API Endpoints

**Public APIs (프론트엔드용)**
```
GET  /api/articles?populate=*&pagination[page]=1&pagination[pageSize]=20
GET  /api/articles/:slug?populate=*
GET  /api/categories?populate=articles
GET  /api/tags?populate=articles
GET  /api/site-config
```

**Admin APIs (자동화 시스템용)**
```
POST   /api/articles (JWT 인증 필요)
PUT    /api/articles/:id
DELETE /api/articles/:id
GET    /api/articles/count
```

#### 3.3 Strapi Plugins 활용

**필수 플러그인**
- `@strapi/plugin-seo`: SEO 필드 자동 관리
- `@strapi/plugin-sitemap`: Sitemap 자동 생성
- `strapi-plugin-slugify`: 슬러그 자동 생성

**선택 플러그인**
- `strapi-plugin-upload`: 미디어 관리 (기본 포함)
- Custom plugin: 트렌드 키워드 대시보드

### 4. 자동화 스케줄러 시스템

#### 4.1 스케줄 설정

**자동화 서비스 구조**
```
crum-automation/
├── src/
│   ├── services/
│   │   ├── trendCollector.js      # 트렌드 수집
│   │   ├── contentGenerator.js    # 콘텐츠 생성
│   │   ├── seoOptimizer.js        # SEO 최적화
│   │   ├── imageService.js        # 이미지 처리
│   │   └── strapiClient.js        # Strapi API 클라이언트
│   ├── jobs/
│   │   ├── collectTrends.js       # Cron: 트렌드 수집
│   │   ├── generateContent.js     # Cron: 콘텐츠 생성
│   │   └── analyzePerformance.js  # Cron: 성과 분석
│   ├── utils/
│   │   ├── logger.js              # Winston 로거
│   │   ├── cache.js               # 캐싱 (Redis 또는 메모리)
│   │   └── errorHandler.js
│   └── index.js                   # 메인 스케줄러
├── .env
└── package.json
```

**실행 주기**
```javascript
// node-cron 설정
import cron from 'node-cron';

// 매 2시간마다: 트렌드 수집
cron.schedule('0 */2 * * *', collectTrends);

// 매 3시간마다: 콘텐츠 생성 (하루 8회)
cron.schedule('0 */3 * * *', generateContent);

// 매일 새벽 3시: 성과 분석 및 정리
cron.schedule('0 3 * * *', analyzePerformance);

// 매주 일요일 새벽 4시: 오래된 트렌드 정리
cron.schedule('0 4 * * 0', cleanupOldData);
```

#### 4.2 콘텐츠 생성 플로우

```javascript
// generateContent.js 예시
async function generateContent() {
  try {
    // 1. 우선순위 높은 키워드 가져오기
    const keywords = await getTopKeywords(5); // 상위 5개

    for (const keyword of keywords) {
      // 2. 중복 체크
      const exists = await checkIfArticleExists(keyword);
      if (exists) continue;

      // 3. 리서치 데이터 수집
      const researchData = await researchKeyword(keyword);

      // 4. LLM으로 콘텐츠 생성
      const article = await generateArticleWithLLM(keyword, researchData);

      // 5. 품질 검증
      const isValid = await validateArticle(article);
      if (!isValid) {
        logger.warn(`Article validation failed for: ${keyword}`);
        continue;
      }

      // 6. 이미지 다운로드
      const imageUrl = await getImageFromUnsplash(keyword);

      // 7. Strapi에 저장 및 발행
      await publishToStrapi({
        ...article,
        featuredImage: imageUrl,
        sourceKeyword: keyword,
        status: 'published'
      });

      logger.info(`Published article: ${article.title}`);

      // 8. API 비용 절약을 위한 딜레이
      await sleep(5000); // 5초 대기
    }

  } catch (error) {
    logger.error('Content generation failed:', error);
    // 알림 발송 (선택)
    await sendErrorNotification(error);
  }
}
```

#### 4.3 에러 핸들링 및 모니터링

**에러 핸들링 전략**
```javascript
// Exponential Backoff Retry
async function callLLMWithRetry(prompt, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await openai.chat.completions.create(prompt);
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      logger.warn(`LLM call failed, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
}
```

**로깅 시스템**
```javascript
// Winston 설정
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});
```

**헬스체크**
```javascript
// 스케줄러 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    lastRun: {
      trendCollection: lastTrendCollectionTime,
      contentGeneration: lastContentGenerationTime
    },
    stats: {
      articlesCreatedToday: todayArticleCount,
      errorsToday: todayErrorCount
    }
  });
});
```

### 5. 프론트엔드 웹사이트

#### 5.1 기술 스택
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **SEO**: next-seo
- **Sitemap**: next-sitemap
- **Analytics**: @next/third-parties (Google Analytics)

#### 5.2 페이지 구조

```
app/
├── layout.tsx              # 루트 레이아웃 (메타태그, GA)
├── page.tsx                # 홈페이지
├── articles/
│   └── [slug]/
│       └── page.tsx        # 게시글 상세
├── category/
│   └── [slug]/
│       └── page.tsx        # 카테고리별 목록
├── tag/
│   └── [slug]/
│       └── page.tsx        # 태그별 목록
├── search/
│   └── page.tsx            # 검색 결과
├── about/
│   └── page.tsx            # 소개
├── sitemap.xml             # 자동 생성 사이트맵
└── robots.txt              # SEO 설정
```

#### 5.3 주요 페이지 상세

**홈페이지 (`/`)**
```tsx
// app/page.tsx
export default async function HomePage() {
  // ISR: 5분마다 재생성
  const articles = await getArticles({ limit: 20 });
  const categories = await getCategories();
  const trendingTags = await getTrendingTags();

  return (
    <>
      {/* Hero Section */}
      <Hero latestArticle={articles[0]} />

      {/* Category Tabs */}
      <CategoryTabs categories={categories} />

      {/* Article Grid */}
      <ArticleGrid articles={articles} />

      {/* Trending Tags */}
      <TrendingTags tags={trendingTags} />

      {/* AdSense - Footer */}
      <AdSenseUnit slot="footer" />
    </>
  );
}

export const revalidate = 300; // 5분
```

**게시글 상세 페이지 (`/articles/[slug]`)**
```tsx
// app/articles/[slug]/page.tsx
export default async function ArticlePage({ params }) {
  const article = await getArticle(params.slug);
  const relatedArticles = await getRelatedArticles(article.id);

  // 조회수 증가 (클라이언트 컴포넌트에서)

  return (
    <article>
      {/* SEO Meta Tags */}
      <ArticleJsonLd article={article} />

      {/* Header */}
      <ArticleHeader
        title={article.title}
        category={article.category}
        publishedAt={article.publishedAt}
        featuredImage={article.featuredImage}
      />

      {/* AdSense - Top */}
      <AdSenseUnit slot="top" />

      {/* Content */}
      <ArticleContent content={article.content} />

      {/* Coupang Partners Widget */}
      {article.category.slug === 'product-review' && (
        <CoupangWidget keyword={article.sourceKeyword} />
      )}

      {/* AdSense - Bottom */}
      <AdSenseUnit slot="bottom" />

      {/* Related Articles */}
      <RelatedArticles articles={relatedArticles} />

      {/* Comments */}
      <GiscusComments />
    </article>
  );
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map(article => ({ slug: article.slug }));
}

export const revalidate = 3600; // 1시간
```

**카테고리 페이지 (`/category/[slug]`)**
```tsx
// app/category/[slug]/page.tsx
export default async function CategoryPage({ params, searchParams }) {
  const page = Number(searchParams.page) || 1;
  const { articles, pagination } = await getArticlesByCategory(
    params.slug,
    page
  );

  return (
    <>
      <CategoryHeader category={category} />
      <ArticleList articles={articles} />
      <Pagination {...pagination} />
    </>
  );
}
```

#### 5.4 SEO 최적화 구현

**메타 태그 자동 생성**
```tsx
// app/articles/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticle(params.slug);

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
      images: [{ url: article.featuredImage }],
      type: 'article',
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage],
    },
    alternates: {
      canonical: `https://crum.blog/articles/${article.slug}`,
    }
  };
}
```

**구조화 데이터 (Schema.org)**
```tsx
// components/ArticleJsonLd.tsx
export function ArticleJsonLd({ article }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Crum Blog'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Crum Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://crum.blog/logo.png'
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

**Sitemap 자동 생성**
```typescript
// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://crum.blog',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin' }
    ]
  },
  exclude: ['/admin/*'],
  // Strapi에서 동적으로 가져오기
  additionalPaths: async (config) => {
    const articles = await getAllArticles();
    return articles.map(article => ({
      loc: `/articles/${article.slug}`,
      lastmod: article.updatedAt,
      priority: 0.8,
      changefreq: 'daily'
    }));
  }
};
```

#### 5.5 성능 최적화

**이미지 최적화**
```tsx
import Image from 'next/image';

<Image
  src={article.featuredImage}
  alt={article.title}
  width={1200}
  height={630}
  priority={false}
  loading="lazy"
  placeholder="blur"
  blurDataURL={article.blurDataURL}
/>
```

**코드 스플리팅**
```tsx
// 무거운 컴포넌트 동적 로딩
const CommentSection = dynamic(() => import('@/components/CommentSection'), {
  ssr: false,
  loading: () => <CommentSkeleton />
});
```

**캐싱 전략**
```typescript
// ISR (Incremental Static Regeneration)
export const revalidate = 300; // 5분

// 데이터 fetching 캐싱
export async function getArticles() {
  const res = await fetch('https://api.crum.blog/articles', {
    next: { revalidate: 300 }
  });
  return res.json();
}
```

### 6. 수익화 시스템

#### 6.1 Google AdSense 통합

**AdSense 스크립트 로드**
```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**AdSense 컴포넌트**
```tsx
// components/AdSense.tsx
'use client';

import { useEffect } from 'react';

export function AdSenseUnit({
  slot,
  format = 'auto',
  responsive = true
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="ad-container my-8">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
```

**광고 배치 위치**
```tsx
// 게시글 상세 페이지
<article>
  {/* 1. 상단 배너 (헤더 아래) */}
  <AdSenseUnit slot="1234567890" format="horizontal" />

  <h1>{article.title}</h1>

  {/* 2. 본문 중간 (3-4 문단 후) */}
  <ArticleContent
    content={article.content}
    insertAd={<AdSenseUnit slot="0987654321" format="rectangle" />}
  />

  {/* 3. 하단 배너 (관련 글 위) */}
  <AdSenseUnit slot="1122334455" format="horizontal" />
</article>

{/* 4. 사이드바 (데스크톱만) */}
<aside className="hidden lg:block">
  <AdSenseUnit slot="5566778899" format="vertical" />
</aside>
```

#### 6.2 쿠팡 파트너스 통합

**Coupang API 클라이언트**
```typescript
// lib/coupang.ts
import crypto from 'crypto';

const COUPANG_ACCESS_KEY = process.env.COUPANG_ACCESS_KEY;
const COUPANG_SECRET_KEY = process.env.COUPANG_SECRET_KEY;

export async function searchCoupangProducts(keyword: string) {
  const method = 'GET';
  const path = `/v2/providers/affiliate_open_api/apis/openapi/products/search`;
  const query = `?keyword=${encodeURIComponent(keyword)}&limit=5`;

  const datetime = new Date().toISOString();
  const message = `${datetime}|${method}|${path}${query}`;

  const signature = crypto
    .createHmac('sha256', COUPANG_SECRET_KEY)
    .update(message)
    .digest('hex');

  const authorization = `CEA algorithm=HmacSHA256, access-key=${COUPANG_ACCESS_KEY}, signed-date=${datetime}, signature=${signature}`;

  const response = await fetch(
    `https://api-gateway.coupang.com${path}${query}`,
    {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.json();
}
```

**상품 위젯 컴포넌트**
```tsx
// components/CoupangWidget.tsx
'use client';

import { useState, useEffect } from 'react';

export function CoupangWidget({ keyword }: { keyword: string }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`/api/coupang/search?q=${keyword}`)
      .then(res => res.json())
      .then(data => setProducts(data.products.slice(0, 3)));
  }, [keyword]);

  if (products.length === 0) return null;

  return (
    <div className="coupang-widget border rounded-lg p-4 my-8">
      <h3 className="text-lg font-bold mb-4">관련 상품 추천</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <a
            key={product.productId}
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block hover:shadow-lg transition"
          >
            <img src={product.productImage} alt={product.productName} />
            <p className="font-medium mt-2">{product.productName}</p>
            <p className="text-red-600 font-bold">{product.productPrice}원</p>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
```

**API Route**
```typescript
// app/api/coupang/search/route.ts
import { searchCoupangProducts } from '@/lib/coupang';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('q');

  if (!keyword) {
    return Response.json({ error: 'Missing keyword' }, { status: 400 });
  }

  try {
    const products = await searchCoupangProducts(keyword);
    return Response.json({ products });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
```

**상품 추천 로직**
```typescript
// 카테고리별 상품 추천 전략
const CATEGORY_PRODUCT_MAPPING = {
  'tech': ['노트북', '스마트폰', '태블릿'],
  'lifestyle': ['생활용품', '인테리어'],
  'health': ['건강식품', '운동기구'],
  'food': ['식재료', '조리도구'],
  'travel': ['여행용품', '캐리어']
};

function shouldShowCoupangWidget(article: Article): boolean {
  // 특정 카테고리만 쿠팡 위젯 표시
  const allowedCategories = ['tech', 'lifestyle', 'health', 'food', 'travel'];
  return allowedCategories.includes(article.category.slug);
}
```

#### 6.3 수익 추적 및 분석

**Google Analytics 4 이벤트 추적**
```tsx
// lib/analytics.ts
export function trackAdClick(adType: 'adsense' | 'coupang', position: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_click', {
      ad_type: adType,
      ad_position: position,
      page_url: window.location.href
    });
  }
}

export function trackArticleView(article: Article) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'article_view', {
      article_id: article.id,
      article_title: article.title,
      article_category: article.category.name,
      trend_score: article.trendScore
    });
  }
}
```

**수익 대시보드 (Strapi Admin)**
```typescript
// Strapi Custom Controller
// api/revenue/controllers/revenue.js

module.exports = {
  async getStats(ctx) {
    // Google AdSense API 또는 수동 입력 데이터 조회
    const adsenseRevenue = await getAdSenseRevenue();
    const coupangRevenue = await getCoupangRevenue();

    // 게시글 성과 분석
    const topArticles = await strapi.db.query('api::article.article').findMany({
      orderBy: { viewCount: 'desc' },
      limit: 10,
      populate: ['category']
    });

    ctx.body = {
      totalRevenue: adsenseRevenue + coupangRevenue,
      adsenseRevenue,
      coupangRevenue,
      topArticles,
      dailyStats: await getDailyStats()
    };
  }
};
```

---

## Technical Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   External Data Sources                  │
│  (Google Trends API, Web Scrapers, News Sites, SNS)    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Automation Service (Node.js)                │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Trend Collector → Content Generator → Publisher │   │
│  │  (Cron Jobs: Every 2-3 hours)                    │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                                │
│              ┌──────────────────────┐                   │
│              │   LLM API Service    │                   │
│              │ (OpenAI / Claude)    │                   │
│              └──────────────────────┘                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  Strapi CMS (Backend)                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Content Types: Articles, Categories, Tags      │   │
│  │  Admin Panel: Content Review & Management       │   │
│  │  REST API: /api/articles, /api/categories       │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                                │
│              ┌──────────────────────┐                   │
│              │ PostgreSQL Database  │                   │
│              └──────────────────────┘                   │
└────────────────────┬────────────────────────────────────┘
                     │ REST API
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Next.js Frontend (crum.blog)                │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Pages: Home, Article, Category, Tag, Search    │   │
│  │  SEO: Meta Tags, Schema.org, Sitemap           │   │
│  │  Rendering: ISR (5min revalidation)            │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    End Users (Visitors)                  │
│              ↓                            ↓              │
│    ┌──────────────────┐        ┌──────────────────┐    │
│    │  Google AdSense  │        │ Coupang Partners │    │
│    │   (Ad Revenue)   │        │ (Affiliate Rev.) │    │
│    └──────────────────┘        └──────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 (App Router) | Server-side rendering, SEO |
| | TypeScript | Type safety |
| | Tailwind CSS | Styling |
| | shadcn/ui | UI components |
| **Backend CMS** | Strapi 5 | Headless CMS, Content management |
| | Node.js 22 | Runtime |
| | PostgreSQL | Database (production) |
| **Automation** | Node.js 22 | Runtime for automation scripts |
| | node-cron | Job scheduling |
| | OpenAI API / Claude API | Content generation |
| | Puppeteer / Cheerio | Web scraping |
| | Axios | HTTP client |
| **Infrastructure** | Vercel | Frontend hosting (Next.js) |
| | Railway / Render | Backend hosting (Strapi + Automation) |
| | Supabase | PostgreSQL database (free tier) |
| | Cloudinary | Image storage & optimization |
| | Cloudflare | CDN & DNS |
| **Monitoring** | Google Analytics 4 | User analytics |
| | Google Search Console | SEO monitoring |
| | Winston | Application logging |
| | Sentry (optional) | Error tracking |
| **Monetization** | Google AdSense | Display advertising |
| | Coupang Partners API | Affiliate marketing |

---

## Data Flow

### 1. Content Creation Flow (자동화)

```
[Cron Trigger: Every 3 hours]
         ↓
[Trend Collector Service]
  - Google Trends API 호출
  - 웹 크롤링 (뉴스, SNS)
  - 키워드 정규화 및 점수화
         ↓
[Keyword Selection]
  - 트렌드 점수 정렬
  - 중복 제거 (기존 게시글 체크)
  - 상위 3-5개 선정
         ↓
[Content Generator Service]
  FOR EACH keyword:
    ↓
  [Research Phase]
    - Google Search API
    - 관련 정보 수집
    ↓
  [LLM API Call]
    - 프롬프트 생성
    - GPT-4o-mini 호출
    - JSON 응답 파싱
    ↓
  [SEO Optimization]
    - Slug 생성
    - Meta tags 생성
    - Schema.org 데이터
    - 내부 링크 추가
    ↓
  [Image Processing]
    - Unsplash API 검색
    - 이미지 다운로드
    - Cloudinary 업로드
    ↓
  [Quality Check]
    - 길이 검증
    - 금칙어 필터링
    - 중복도 체크
    ↓
  [Publish to Strapi]
    - POST /api/articles
    - status: 'published'
    - publishedAt: now()
         ↓
[Update Sitemap]
  - next-sitemap 재생성
  - Google Search Console ping
         ↓
[Logging & Monitoring]
  - 성공/실패 로그 기록
  - 통계 업데이트
```

### 2. User Visit Flow

```
[User searches on Google]
         ↓
[Lands on crum.blog/articles/xxx]
         ↓
[Next.js ISR Render]
  - Check cache (5min TTL)
  - If expired: Fetch from Strapi API
  - Server-side render HTML
         ↓
[Browser receives HTML]
  - Render content
  - Load AdSense script
  - Track page view (GA4)
         ↓
[User scrolls page]
  - AdSense impression counted
  - (Optional) Clicks Coupang product
         ↓
[Ad Click / Affiliate Click]
  - Track event in GA4
  - Redirect to advertiser
  - Commission recorded
         ↓
[Revenue Attribution]
  - Google AdSense dashboard
  - Coupang Partners dashboard
```

---

## Development Phases

### Phase 1: Foundation Setup (Week 1)
**Goal**: 기본 인프라 구축 및 수동 콘텐츠 발행 가능

**Backend**
- [ ] Strapi 5 설치 및 초기 설정
- [ ] PostgreSQL 데이터베이스 연결 (Supabase)
- [ ] Content Types 생성 (Article, Category, Tag, Advertisement, SiteConfig)
- [ ] 초기 카테고리 데이터 입력
- [ ] Strapi Admin Panel 접근 확인
- [ ] API 엔드포인트 테스트

**Frontend**
- [ ] Next.js 14 프로젝트 초기화 (TypeScript)
- [ ] Tailwind CSS 설정
- [ ] shadcn/ui 설치 및 기본 컴포넌트 설정
- [ ] Strapi API 클라이언트 함수 작성 (`lib/strapi.ts`)
- [ ] 기본 레이아웃 구현 (Header, Footer)
- [ ] 홈페이지 구현 (게시글 목록)
- [ ] 게시글 상세 페이지 구현

**Infrastructure**
- [ ] GitHub 저장소 생성
- [ ] Vercel 프로젝트 연결 (프론트엔드)
- [ ] Railway/Render 프로젝트 연결 (백엔드)
- [ ] 환경변수 설정
- [ ] crum.blog 도메인 연결 (Vercel)
- [ ] SSL 인증서 확인

**Deliverable**: 수동으로 게시글을 작성하면 웹사이트에 표시되는 기본 블로그

### Phase 2: Automation System (Week 2-3)
**Goal**: 트렌드 수집 및 콘텐츠 자동 생성 시스템 구축

**Trend Collection**
- [ ] Google Trends API 연동
  - [ ] API 키 발급
  - [ ] 실시간 인기 검색어 수집 함수
  - [ ] 카테고리별 트렌드 추출
- [ ] 웹 크롤러 구현
  - [ ] Puppeteer 설정
  - [ ] 네이버 트렌드 크롤링
  - [ ] 뉴스 헤드라인 크롤링
- [ ] 키워드 처리 로직
  - [ ] 중복 제거
  - [ ] 트렌드 점수 계산
  - [ ] DB 저장 (임시 테이블)

**Content Generation**
- [ ] OpenAI API 연동
  - [ ] API 키 설정
  - [ ] 프롬프트 템플릿 작성
  - [ ] JSON 파싱 로직
- [ ] 콘텐츠 생성 파이프라인
  - [ ] 리서치 함수 (Google Search API)
  - [ ] LLM 호출 및 재시도 로직
  - [ ] SEO 최적화 처리
  - [ ] Slug 생성
- [ ] 이미지 처리
  - [ ] Unsplash API 연동
  - [ ] Cloudinary 업로드
  - [ ] 대체 이미지 처리

**Scheduling**
- [ ] node-cron 설정
- [ ] 트렌드 수집 Job (매 2시간)
- [ ] 콘텐츠 생성 Job (매 3시간)
- [ ] 로깅 시스템 (Winston)
- [ ] 에러 핸들링

**Testing**
- [ ] 수동 트리거로 전체 플로우 테스트
- [ ] 10개 이상 게시글 자동 생성 테스트
- [ ] 품질 검증 로직 테스트

**Deliverable**: 자동으로 하루 8개 이상의 게시글이 생성되는 시스템

### Phase 3: SEO Optimization (Week 4)
**Goal**: 검색 엔진 최적화 및 노출 극대화

**On-Page SEO**
- [ ] 메타 태그 자동 생성 (`generateMetadata`)
- [ ] Open Graph 태그
- [ ] Twitter Card 태그
- [ ] Canonical URL 설정
- [ ] Schema.org Article 구조화 데이터
- [ ] 이미지 alt 텍스트 자동 생성

**Technical SEO**
- [ ] Sitemap 자동 생성 (next-sitemap)
- [ ] robots.txt 최적화
- [ ] 내부 링크 자동 추가 로직
- [ ] 404 페이지 커스터마이징
- [ ] 리디렉션 설정 (필요 시)

**Performance**
- [ ] Lighthouse 성능 측정 (목표: 90+)
- [ ] 이미지 최적화 (WebP, lazy loading)
- [ ] Code splitting
- [ ] ISR revalidation 설정 최적화
- [ ] CDN 캐싱 확인 (Cloudflare)

**Search Console**
- [ ] Google Search Console 등록
- [ ] Sitemap 제출
- [ ] URL 검사 및 색인 요청
- [ ] Core Web Vitals 모니터링

**Analytics**
- [ ] Google Analytics 4 설치
- [ ] 이벤트 추적 설정 (페이지뷰, 스크롤, 클릭)
- [ ] 전환 목표 설정

**Deliverable**: SEO 최적화 완료, 검색 엔진에 색인 시작

### Phase 4: Monetization (Week 5-6)
**Goal**: 수익화 시스템 구축 및 최적화

**Google AdSense**
- [ ] AdSense 계정 신청
- [ ] 사이트 승인 대기 (보통 1-2주)
- [ ] 광고 코드 삽입
- [ ] 광고 단위 생성 (header, sidebar, in-content, footer)
- [ ] 반응형 광고 설정
- [ ] 광고 위치 A/B 테스트

**Coupang Partners**
- [ ] 쿠팡 파트너스 가입
- [ ] API 키 발급
- [ ] API 클라이언트 구현
- [ ] 상품 검색 함수
- [ ] 위젯 컴포넌트 제작
- [ ] 카테고리별 상품 추천 로직
- [ ] 법적 고지사항 추가

**Optimization**
- [ ] 광고 밀도 조절 (사용자 경험 고려)
- [ ] 모바일 광고 최적화
- [ ] 쿠팡 상품 매칭 알고리즘 개선
- [ ] 클릭률(CTR) 모니터링

**Revenue Tracking**
- [ ] GA4 이벤트 추적 (광고 클릭, 제휴 클릭)
- [ ] Strapi Admin 수익 대시보드 (선택)

**Deliverable**: 광고 및 제휴 링크가 적용되어 수익 창출 시작

### Phase 5: Monitoring & Improvement (Week 7+)
**Goal**: 데이터 기반 지속적 개선

**Monitoring**
- [ ] 일일 통계 대시보드 구축
  - [ ] 게시글 생성 수
  - [ ] 방문자 수
  - [ ] 인기 게시글
  - [ ] 수익 현황
- [ ] 에러 모니터링 (Sentry 설치, 선택)
- [ ] 서버 헬스체크 엔드포인트
- [ ] Uptime 모니터링 (UptimeRobot, 선택)

**Content Strategy**
- [ ] 인기 키워드 분석
- [ ] 카테고리별 성과 분석
- [ ] 저성과 카테고리 개선
- [ ] 계절/이벤트 기반 콘텐츠 전략

**SEO Performance**
- [ ] 주간 SEO 리포트
- [ ] 랭킹 키워드 추적
- [ ] 백링크 구축 전략
- [ ] 경쟁사 분석

**User Experience**
- [ ] 사용자 피드백 수집 (댓글, 설문)
- [ ] 페이지 속도 지속 모니터링
- [ ] 모바일 UX 개선
- [ ] 접근성 개선 (WCAG)

**Scaling**
- [ ] 일일 게시글 수 증가 (8개 → 15개)
- [ ] 다국어 지원 고려 (영문 콘텐츠)
- [ ] 뉴스레터 구독 기능 (선택)
- [ ] 소셜 미디어 자동 포스팅 (선택)

**Deliverable**: 안정적인 운영 및 지속적인 트래픽/수익 증가

---

## Key Performance Indicators (KPIs)

### Traffic Metrics

| Metric | 1개월 | 3개월 | 6개월 | 12개월 |
|--------|-------|-------|-------|--------|
| Daily Active Users (DAU) | 100 | 500 | 1,500 | 5,000 |
| Monthly Active Users (MAU) | 3,000 | 15,000 | 45,000 | 150,000 |
| Organic Traffic % | 50% | 65% | 75% | 80% |
| Avg. Session Duration | 1m 30s | 2m | 2m 30s | 3m |
| Bounce Rate | 70% | 65% | 60% | 55% |
| Pages per Session | 1.5 | 2.0 | 2.5 | 3.0 |

### SEO Metrics

| Metric | 1개월 | 3개월 | 6개월 | 12개월 |
|--------|-------|-------|-------|--------|
| Total Articles | 250 | 750 | 1,500 | 3,000 |
| Indexed Pages | 150 | 500 | 1,200 | 2,500 |
| Top 10 Rankings | 10 | 50 | 150 | 300 |
| Top 100 Rankings | 50 | 200 | 500 | 1,000 |
| Domain Authority (Moz) | 5 | 15 | 25 | 35 |
| Referring Domains | 5 | 20 | 50 | 100 |

### Content Metrics

| Metric | Target |
|--------|--------|
| Articles per Day | 8-10 |
| Avg. Article Length | 1,200-1,800자 |
| Content Quality Score | 8/10 이상 |
| Duplicate Content Rate | < 5% |
| Failed Generation Rate | < 10% |

### Revenue Metrics

| Metric | 1개월 | 3개월 | 6개월 | 12개월 |
|--------|-------|-------|-------|--------|
| **Total Revenue** | ₩50,000 | ₩300,000 | ₩1,000,000 | ₩2,500,000 |
| AdSense Revenue | ₩30,000 | ₩200,000 | ₩700,000 | ₩1,700,000 |
| Coupang Revenue | ₩20,000 | ₩100,000 | ₩300,000 | ₩800,000 |
| **Metrics** | | | | |
| AdSense RPM | ₩3,000 | ₩4,000 | ₩5,000 | ₩6,000 |
| AdSense CTR | 1.0% | 1.2% | 1.5% | 1.8% |
| Coupang Conv. Rate | 1.0% | 1.5% | 2.0% | 2.5% |
| **ROI** | -144% | +145% | +718% | +1,948% |

*ROI 계산 기준: 월 운영비 ₩122,000*

---

## Risk Management

### Technical Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **LLM API 비용 폭발** | Medium | High | • 일일 토큰 사용량 제한 설정<br>• GPT-4o-mini 우선 사용<br>• 캐싱 전략<br>• 비용 알림 설정 |
| **크롤링 차단** | Medium | Medium | • User-Agent 로테이션<br>• IP 프록시 사용<br>• 다양한 데이터 소스 확보<br>• Rate limiting 준수 |
| **Strapi 서버 다운** | Low | High | • 자동 재시작 설정<br>• 헬스체크 모니터링<br>• 데이터베이스 백업 (일 1회)<br>• Uptime 모니터링 |
| **데이터베이스 용량 초과** | Low | Medium | • 오래된 로그 정리<br>• 이미지 외부 저장 (Cloudinary)<br>• 무료 티어 한계 모니터링 |
| **SEO 패널티** | Low | High | • 콘텐츠 품질 검증<br>• 표절 방지 체크<br>• 스팸 필터링<br>• Google 가이드라인 준수 |

### Business Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **AdSense 승인 거부** | Medium | High | • 고품질 콘텐츠 우선 발행 (50개+)<br>• 정책 준수 체크리스트<br>• 대체 광고 네트워크 준비 (Mediavine 등) |
| **낮은 초기 트래픽** | High | Medium | • SEO 최적화 강화<br>• SNS 마케팅 (선택)<br>• 백링크 구축<br>• 인내심 (보통 3-6개월 소요) |
| **광고 수익 저조** | Medium | Medium | • 광고 위치 최적화<br>• 고CPC 키워드 타겟팅<br>• 쿠팡 제휴 강화 |
| **경쟁사 등장** | Low | Low | • 빠른 콘텐츠 생성 속도<br>• 독특한 주제 선정<br>• 브랜드 차별화 |
| **트렌드 소진** | Low | Medium | • 다양한 카테고리 커버<br>• Evergreen 콘텐츠 혼합<br>• 계절별 콘텐츠 전략 |

### Legal Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **저작권 침해** | Low | High | • AI 생성 콘텐츠 사용<br>• 출처 명확히 표기<br>• 표절 검사 도구 사용<br>• 이미지 라이선스 준수 (Unsplash) |
| **개인정보 보호법 위반** | Low | Medium | • 쿠키 동의 팝업<br>• 개인정보처리방침 페이지<br>• GA4 익명화 설정<br>• GDPR 준수 (해외 유저 시) |
| **광고 정책 위반** | Medium | High | • AdSense 정책 정기 검토<br>• 부적절한 콘텐츠 필터링<br>• 금칙어 리스트 관리<br>• 성인/도박/폭력 주제 제외 |
| **허위 정보 유포** | Low | Medium | • 신뢰할 수 있는 소스만 사용<br>• 팩트 체크 프로세스<br>• 면책 조항 추가 |

---

## Budget & Cost Analysis

### Initial Setup Costs (One-time)

| Item | Cost |
|------|------|
| Domain (crum.blog) | Already purchased |
| Logo & Branding Design | ₩0 (DIY) or ₩100,000 (외주) |
| Development | ₩0 (Self-developed) |
| **Total** | **₩0 ~ ₩100,000** |

### Monthly Operating Costs

| Category | Item | Cost | Note |
|----------|------|------|------|
| **Hosting** | Vercel (Frontend) | ₩0 | Free tier (충분함) |
| | Railway/Render (Backend) | ₩20,000 | Hobby plan |
| | Supabase (PostgreSQL) | ₩0 | Free tier (500MB, 충분함) |
| **Domain** | crum.blog renewal | ₩2,000 | 연 ₩24,000 / 12 |
| **CDN & Storage** | Cloudflare CDN | ₩0 | Free tier |
| | Cloudinary (Images) | ₩0 | Free tier (25 credits) |
| **APIs** | Google Trends API | ₩0 | Free |
| | Google Search API | ₩0 or ₩3,000 | Free tier (100 calls/day) |
| | Unsplash API | ₩0 | Free (50 calls/hour) |
| | OpenAI API (GPT-4o-mini) | ₩100,000 | ~250 articles/month |
| | Coupang Partners API | ₩0 | Free |
| **Monitoring** | Google Analytics 4 | ₩0 | Free |
| | Google Search Console | ₩0 | Free |
| | Sentry (Optional) | ₩0 | Free tier |
| **Total** | | **~₩125,000/month** | |

### LLM API Cost Breakdown

**GPT-4o-mini Pricing** (2024년 기준)
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens

**예상 토큰 사용량 (1개 게시글)**
- 프롬프트 (input): ~2,000 tokens
- 생성 콘텐츠 (output): ~2,500 tokens
- 비용: ($0.15 × 0.002) + ($0.60 × 0.0025) = $0.0018 ≈ ₩2.4

**월간 비용 (하루 8개 × 30일 = 240개)**
- 240 × ₩2.4 = ₩576
- 실제로는 재시도, 버퍼 고려 → ₩1,000 ~ ₩2,000

**여유 예산 ₩100,000 → 충분히 감당 가능**

### Revenue Projection

| Month | Traffic (MAU) | AdSense | Coupang | Total | Costs | **Profit** |
|-------|---------------|---------|---------|-------|-------|------------|
| 1 | 3,000 | ₩30,000 | ₩20,000 | ₩50,000 | ₩125,000 | **-₩75,000** |
| 2 | 7,000 | ₩80,000 | ₩40,000 | ₩120,000 | ₩125,000 | **-₩5,000** |
| 3 | 15,000 | ₩200,000 | ₩100,000 | ₩300,000 | ₩125,000 | **+₩175,000** |
| 6 | 45,000 | ₩700,000 | ₩300,000 | ₩1,000,000 | ₩125,000 | **+₩875,000** |
| 12 | 150,000 | ₩1,700,000 | ₩800,000 | ₩2,500,000 | ₩125,000 | **+₩2,375,000** |

**Break-even Point**: 2-3개월 차
**Cumulative Profit (12 months)**: ~₩10,000,000

---

## Success Criteria

### 3개월 후 (Early Success)
- ✅ 750개 이상 게시글 발행
- ✅ MAU 15,000 이상
- ✅ Google 검색 Top 100 랭킹 200개 이상
- ✅ Google AdSense 승인 및 광고 게재
- ✅ 월 수익 ₩300,000 달성
- ✅ 자동화 시스템 안정 운영 (에러율 < 10%)

### 6개월 후 (Product-Market Fit)
- ✅ 1,500개 이상 게시글 발행
- ✅ MAU 45,000 이상
- ✅ Google 검색 Top 10 랭킹 150개 이상
- ✅ 월 수익 ₩1,000,000 달성
- ✅ Domain Authority 25+
- ✅ 특정 카테고리에서 인지도 확보

### 12개월 후 (Scale-up)
- ✅ 3,000개 이상 게시글 발행
- ✅ MAU 150,000 이상
- ✅ Google 검색 Top 10 랭킹 300개 이상
- ✅ 월 수익 ₩2,500,000 달성
- ✅ 브랜드 인지도 확립 (직접 유입 20% 이상)
- ✅ 수익 다각화 (AdSense + Coupang + 기타)

---

## Appendix

### A. Competitor Analysis

| Competitor | Type | Strengths | Weaknesses | Differentiation |
|------------|------|-----------|------------|-----------------|
| 티스토리 블로그들 | 개인 블로그 | 다양한 주제, 개성 | 업데이트 불규칙, SEO 약함 | **자동화된 일일 업데이트** |
| 브런치 | 큐레이션 | 고품질 콘텐츠 | 느린 업데이트 | **실시간 트렌드 반영** |
| 네이버 블로그 | 포털 블로그 | 높은 트래픽 | SEO 제한적 | **Google 검색 최적화** |
| 뉴스 사이트 | 미디어 | 신뢰성, 속보 | 딱딱함, 광고 과다 | **쉬운 설명, 깔끔한 UX** |

### B. SEO Keywords Strategy

**High-Volume Keywords** (월 검색량 10,000+)
- "오늘의 이슈"
- "실시간 검색어"
- "최신 뉴스"
- "[트렌드 키워드] 뭐야"

**Long-tail Keywords** (월 검색량 1,000~10,000)
- "2025 [트렌드 키워드] 정리"
- "[키워드] 총정리"
- "[키워드] 왜 유명해졌나"
- "[키워드] 쉽게 설명"

**Question Keywords** (높은 전환율)
- "[키워드] 뭐야?"
- "[키워드] 어떻게 되는거야?"
- "[키워드] 왜 난리야?"
- "[키워드] 진짜야?"

### C. Content Categories (Initial 10)

1. **뉴스/시사** - 정치, 사회, 국제 이슈
2. **엔터테인먼트** - 연예, 영화, 드라마, 음악
3. **기술/IT** - 스마트폰, 소프트웨어, AI, 가젯
4. **생활** - 육아, 인테리어, 생활 팁
5. **경제/재테크** - 주식, 부동산, 투자, 절약
6. **건강/의료** - 질병, 운동, 다이어트, 정신건강
7. **요리/맛집** - 레시피, 맛집 리뷰, 배달 음식
8. **여행/문화** - 국내여행, 해외여행, 문화 행사
9. **스포츠** - 축구, 야구, 농구, e스포츠
10. **교육** - 학습, 자격증, 육아 교육

### D. Legal Pages Required

**필수 페이지**
- `/privacy`: 개인정보처리방침
- `/terms`: 이용약관
- `/disclaimer`: 면책조항

**AdSense 필수 항목**
- 쿠키 사용 안내
- 광고 파트너 (Google) 명시
- 사용자 데이터 수집 방법

**Coupang Partners 필수**
- "이 포스팅은 쿠팡 파트너스 활동의 일환으로..." 문구

### E. Useful Tools & Resources

**SEO Tools**
- Google Search Console (필수)
- Google Analytics 4 (필수)
- Ahrefs / SEMrush (유료, 선택)
- Ubersuggest (키워드 리서치)

**Content Tools**
- Grammarly (영문 교정, 선택)
- Copyscape (표절 검사)
- Hemingway Editor (가독성 체크)

**Image Resources**
- Unsplash (무료 고품질 이미지)
- Pexels (대체)
- Canva (썸네일 제작)

**Monitoring**
- UptimeRobot (서버 모니터링)
- Sentry (에러 추적)
- LogRocket (사용자 세션 녹화, 선택)

---

## Next Steps

### Immediate Actions (This Week)

1. **PRD 검토 및 승인** ✅
2. **개발 환경 세팅**
   - Node.js 22 설치 확인
   - PostgreSQL 클라이언트 설치
   - Git 저장소 초기화
3. **계정 생성**
   - Supabase 계정
   - Railway/Render 계정
   - Vercel 계정
   - Cloudinary 계정
   - OpenAI API 키 발급
4. **Phase 1 개발 시작**
   - Strapi 5 설치
   - Next.js 14 프로젝트 생성

### Weekly Milestones

- **Week 1**: Phase 1 완료 (기본 블로그 동작)
- **Week 2-3**: Phase 2 완료 (자동화 시스템)
- **Week 4**: Phase 3 완료 (SEO 최적화)
- **Week 5-6**: Phase 4 완료 (수익화)
- **Week 7+**: Phase 5 (모니터링 & 개선)

---

**Document Version**: 2.0
**Last Updated**: 2025-10-22
**Product Type**: 자동화 블로그 사이트 (단일 사이트)
**Status**: Ready for Development
