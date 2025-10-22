import { NextRequest, NextResponse } from 'next/server';

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

interface CoupangApiResponse {
  products: CoupangProduct[];
  totalCount: number;
  page: number;
  hasMore: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '4');
    const page = parseInt(searchParams.get('page') || '1');

    if (!keyword) {
      return NextResponse.json(
        { error: '키워드가 필요합니다.' },
        { status: 400 }
      );
    }

    // Coupang Partners API 호출
    const products = await fetchCoupangProducts({
      keyword,
      category,
      limit,
      page
    });

    const response: CoupangApiResponse = {
      products,
      totalCount: products.length,
      page,
      hasMore: products.length === limit
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Coupang API 오류:', error);
    return NextResponse.json(
      { error: '상품 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

async function fetchCoupangProducts({
  keyword,
  category,
  limit,
  page
}: {
  keyword: string;
  category?: string | null;
  limit: number;
  page: number;
}): Promise<CoupangProduct[]> {
  try {
    // 실제 Coupang Partners API 호출
    const apiUrl = 'https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/products/search';

    const params = new URLSearchParams({
      keyword,
      limit: limit.toString(),
      page: page.toString(),
      ...(category && { category })
    });

    const response = await fetch(`${apiUrl}?${params}`, {
      headers: {
        'Authorization': `Bearer ${process.env.COUPANG_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Coupang API 오류: ${response.status}`);
    }

    const data = await response.json();

    // API 응답을 우리 형식으로 변환
    return data.data?.productData?.map((product: any) => ({
      productId: product.productId,
      productName: product.productName,
      productPrice: product.productPrice,
      productImage: product.productImage,
      productUrl: product.productUrl,
      discountRate: product.discountRate,
      originalPrice: product.originalPrice,
      rating: product.rating,
      reviewCount: product.reviewCount,
      categoryName: product.categoryName,
      brand: product.brand,
      isRocketDelivery: product.isRocketDelivery,
      isRocketFresh: product.isRocketFresh
    })) || [];

  } catch (error) {
    console.error('Coupang API 호출 실패:', error);

    // API 실패 시 더미 데이터 반환 (개발용)
    if (process.env.NODE_ENV === 'development') {
      return generateDummyProducts(keyword, limit);
    }

    throw error;
  }
}

// 개발용 더미 데이터 생성
function generateDummyProducts(keyword: string, limit: number): CoupangProduct[] {
  const dummyProducts: CoupangProduct[] = [
    {
      productId: '1',
      productName: `${keyword} 관련 추천 상품 1`,
      productPrice: 29900,
      productImage: 'https://via.placeholder.com/300x300/cccccc/666666?text=Product+1',
      productUrl: 'https://www.coupang.com/vp/products/1',
      discountRate: 15,
      originalPrice: 35000,
      rating: 4.5,
      reviewCount: 1234,
      categoryName: '전자제품',
      brand: '브랜드A',
      isRocketDelivery: true,
      isRocketFresh: false
    },
    {
      productId: '2',
      productName: `${keyword} 관련 추천 상품 2`,
      productPrice: 15900,
      productImage: 'https://via.placeholder.com/300x300/cccccc/666666?text=Product+2',
      productUrl: 'https://www.coupang.com/vp/products/2',
      discountRate: 20,
      originalPrice: 19900,
      rating: 4.2,
      reviewCount: 856,
      categoryName: '생활용품',
      brand: '브랜드B',
      isRocketDelivery: true,
      isRocketFresh: false
    },
    {
      productId: '3',
      productName: `${keyword} 관련 추천 상품 3`,
      productPrice: 45900,
      productImage: 'https://via.placeholder.com/300x300/cccccc/666666?text=Product+3',
      productUrl: 'https://www.coupang.com/vp/products/3',
      discountRate: 10,
      originalPrice: 51000,
      rating: 4.8,
      reviewCount: 2156,
      categoryName: '가전제품',
      brand: '브랜드C',
      isRocketDelivery: true,
      isRocketFresh: true
    },
    {
      productId: '4',
      productName: `${keyword} 관련 추천 상품 4`,
      productPrice: 8900,
      productImage: 'https://via.placeholder.com/300x300/cccccc/666666?text=Product+4',
      productUrl: 'https://www.coupang.com/vp/products/4',
      discountRate: 5,
      originalPrice: 9400,
      rating: 4.0,
      reviewCount: 432,
      categoryName: '소품',
      brand: '브랜드D',
      isRocketDelivery: false,
      isRocketFresh: false
    }
  ];

  return dummyProducts.slice(0, limit);
}
