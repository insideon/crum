// Strapi API 클라이언트 설정
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true' || true; // 임시로 항상 더미 데이터 사용

export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  sourceKeyword?: string;
  trendScore?: number;
  viewCount: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  tags?: Tag[];
  featuredImage?: {
    url: string;
    alternativeText?: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  articles?: Article[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
  articles?: Article[];
}

export interface SiteConfig {
  id: number;
  siteName: string;
  siteDescription?: string;
  siteUrl: string;
  logoUrl?: string;
  faviconUrl?: string;
  defaultOgImage?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
  twitterHandle?: string;
  automationEnabled: boolean;
  articlesPerDay: number;
  minTrendScore: number;
}

// API 클라이언트 함수들
export async function getArticles(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<{ data: Article[]; meta: { pagination: any } }> {
  // 더미 데이터 사용
  if (USE_DUMMY_DATA) {
    const { dummyArticles } = await import('./dummy-data');
    let filteredArticles = [...dummyArticles];

    // 필터링
    if (params?.category) {
      filteredArticles = filteredArticles.filter(
        article => article.category?.slug === params.category
      );
    }
    if (params?.tag) {
      filteredArticles = filteredArticles.filter(
        article => article.tags?.some(tag => tag.slug === params.tag)
      );
    }
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredArticles = filteredArticles.filter(
        article => article.title.toLowerCase().includes(searchLower) ||
                   article.excerpt.toLowerCase().includes(searchLower)
      );
    }

    // 페이지네이션
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedArticles = filteredArticles.slice(start, end);

    return {
      data: paginatedArticles,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(filteredArticles.length / pageSize),
          total: filteredArticles.length
        }
      }
    };
  }

  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append('pagination[page]', params.page.toString());
  if (params?.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString());
  if (params?.category) searchParams.append('filters[category][slug][$eq]', params.category);
  if (params?.tag) searchParams.append('filters[tags][slug][$eq]', params.tag);
  if (params?.search) searchParams.append('filters[$or][0][title][$containsi]', params.search);

  searchParams.append('populate', '*');
  searchParams.append('sort', 'publishedAt:desc');

  const response = await fetch(`${STRAPI_URL}/api/articles?${searchParams}`, {
    next: { revalidate: 300 } // 5분마다 재검증 (ISR)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }

  return response.json();
}

export async function getArticle(slug: string): Promise<Article> {
  // 더미 데이터 사용
  if (USE_DUMMY_DATA) {
    const { dummyArticles } = await import('./dummy-data');
    const article = dummyArticles.find(a => a.slug === slug);

    if (!article) {
      throw new Error('Article not found');
    }

    return article;
  }

  const response = await fetch(
    `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`,
    {
      next: { revalidate: 300 } // 5분마다 재검증 (ISR)
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }

  const data = await response.json();

  if (!data.data || data.data.length === 0) {
    throw new Error('Article not found');
  }

  return data.data[0];
}

export async function getCategories(): Promise<Category[]> {
  // 더미 데이터 사용
  if (USE_DUMMY_DATA) {
    const { dummyCategories } = await import('./dummy-data');
    return dummyCategories;
  }

  const response = await fetch(`${STRAPI_URL}/api/categories?populate=articles&sort=order:asc`, {
    next: { revalidate: 3600 } // 1시간마다 재검증 (카테고리는 자주 변경되지 않음)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await response.json();
  return data.data || [];
}

export async function getTags(): Promise<Tag[]> {
  // 더미 데이터 사용
  if (USE_DUMMY_DATA) {
    const { dummyTags } = await import('./dummy-data');
    return dummyTags;
  }

  const response = await fetch(`${STRAPI_URL}/api/tags?populate=articles&sort=count:desc`, {
    next: { revalidate: 600 } // 10분마다 재검증
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }

  const data = await response.json();
  return data.data || [];
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const response = await fetch(`${STRAPI_URL}/api/site-config`, {
    next: { revalidate: 3600 } // 1시간마다 재검증 (사이트 설정은 자주 변경되지 않음)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch site config');
  }

  const data = await response.json();
  return data.data;
}

export async function getPopularArticles(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<{ data: Article[]; meta: { pagination: any } }> {
  // 더미 데이터 사용
  if (USE_DUMMY_DATA) {
    const { dummyArticles } = await import('./dummy-data');
    let filteredArticles = [...dummyArticles];

    // 필터링
    if (params?.category) {
      filteredArticles = filteredArticles.filter(
        article => article.category?.slug === params.category
      );
    }
    if (params?.tag) {
      filteredArticles = filteredArticles.filter(
        article => article.tags?.some(tag => tag.slug === params.tag)
      );
    }
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredArticles = filteredArticles.filter(
        article => article.title.toLowerCase().includes(searchLower) ||
                   article.excerpt.toLowerCase().includes(searchLower)
      );
    }

    // 조회수 기준으로 정렬 (인기순)
    filteredArticles.sort((a, b) => b.viewCount - a.viewCount);

    // 페이지네이션
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedArticles = filteredArticles.slice(start, end);

    return {
      data: paginatedArticles,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(filteredArticles.length / pageSize),
          total: filteredArticles.length
        }
      }
    };
  }

  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append('pagination[page]', params.page.toString());
  if (params?.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString());
  if (params?.category) searchParams.append('filters[category][slug][$eq]', params.category);
  if (params?.tag) searchParams.append('filters[tags][slug][$eq]', params.tag);
  if (params?.search) searchParams.append('filters[$or][0][title][$containsi]', params.search);

  searchParams.append('populate', '*');
  searchParams.append('sort', 'viewCount:desc'); // 조회수 기준 정렬

  const response = await fetch(`${STRAPI_URL}/api/articles?${searchParams}`, {
    next: { revalidate: 300 } // 5분마다 재검증 (ISR)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch popular articles');
  }

  return response.json();
}

export async function getPopularArticlesByPeriod(period: 'today' | 'week' | 'month' | 'year', params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<{ data: Article[]; meta: { pagination: any } }> {
  // 더미 데이터 사용
  if (USE_DUMMY_DATA) {
    const { dummyArticles } = await import('./dummy-data');
    let filteredArticles = [...dummyArticles];

    // 기간별 필터링
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 기본값: 이번 주
    }

    filteredArticles = filteredArticles.filter(article => {
      const publishedDate = new Date(article.publishedAt);
      return publishedDate >= startDate;
    });

    // 추가 필터링
    if (params?.category) {
      filteredArticles = filteredArticles.filter(
        article => article.category?.slug === params.category
      );
    }
    if (params?.tag) {
      filteredArticles = filteredArticles.filter(
        article => article.tags?.some(tag => tag.slug === params.tag)
      );
    }
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredArticles = filteredArticles.filter(
        article => article.title.toLowerCase().includes(searchLower) ||
                   article.excerpt.toLowerCase().includes(searchLower)
      );
    }

    // 조회수 기준으로 정렬 (인기순)
    filteredArticles.sort((a, b) => b.viewCount - a.viewCount);

    // 페이지네이션
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedArticles = filteredArticles.slice(start, end);

    return {
      data: paginatedArticles,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(filteredArticles.length / pageSize),
          total: filteredArticles.length
        }
      }
    };
  }

  const searchParams = new URLSearchParams();

  // 기간별 필터링
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 기본값: 이번 주
  }

  searchParams.append('filters[publishedAt][$gte]', startDate.toISOString());

  if (params?.page) searchParams.append('pagination[page]', params.page.toString());
  if (params?.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString());
  if (params?.category) searchParams.append('filters[category][slug][$eq]', params.category);
  if (params?.tag) searchParams.append('filters[tags][slug][$eq]', params.tag);
  if (params?.search) searchParams.append('filters[$or][0][title][$containsi]', params.search);

  searchParams.append('populate', '*');
  searchParams.append('sort', 'viewCount:desc'); // 조회수 기준 정렬

  const response = await fetch(`${STRAPI_URL}/api/articles?${searchParams}`, {
    next: { revalidate: 300 } // 5분마다 재검증 (ISR)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch popular articles by period');
  }

  return response.json();
}

export async function getRelatedArticles(articleId: number, limit: number = 5): Promise<Article[]> {
  // 더미 데이터 사용
  if (USE_DUMMY_DATA) {
    const { dummyArticles } = await import('./dummy-data');
    return dummyArticles
      .filter(a => a.id !== articleId)
      .slice(0, limit);
  }

  const response = await fetch(
    `${STRAPI_URL}/api/articles?filters[id][$ne]=${articleId}&populate=*&pagination[limit]=${limit}&sort=publishedAt:desc`,
    {
      next: { revalidate: 300 } // 5분마다 재검증
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch related articles');
  }

  const data = await response.json();
  return data.data || [];
}
