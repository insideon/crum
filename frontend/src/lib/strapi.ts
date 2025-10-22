// Strapi API 클라이언트 설정
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

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
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('pagination[page]', params.page.toString());
  if (params?.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString());
  if (params?.category) searchParams.append('filters[category][slug][$eq]', params.category);
  if (params?.tag) searchParams.append('filters[tags][slug][$eq]', params.tag);
  if (params?.search) searchParams.append('filters[$or][0][title][$containsi]', params.search);
  
  searchParams.append('populate', '*');
  searchParams.append('sort', 'publishedAt:desc');
  
  const response = await fetch(`${STRAPI_URL}/api/articles?${searchParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  
  return response.json();
}

export async function getArticle(slug: string): Promise<Article> {
  const response = await fetch(
    `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`
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
  const response = await fetch(`${STRAPI_URL}/api/categories?populate=articles&sort=order:asc`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  const data = await response.json();
  return data.data || [];
}

export async function getTags(): Promise<Tag[]> {
  const response = await fetch(`${STRAPI_URL}/api/tags?populate=articles&sort=count:desc`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }
  
  const data = await response.json();
  return data.data || [];
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const response = await fetch(`${STRAPI_URL}/api/site-config`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch site config');
  }
  
  const data = await response.json();
  return data.data;
}

export async function getRelatedArticles(articleId: number, limit: number = 5): Promise<Article[]> {
  const response = await fetch(
    `${STRAPI_URL}/api/articles?filters[id][$ne]=${articleId}&populate=*&pagination[limit]=${limit}&sort=publishedAt:desc`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch related articles');
  }
  
  const data = await response.json();
  return data.data || [];
}
