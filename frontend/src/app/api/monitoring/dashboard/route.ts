import { NextRequest, NextResponse } from 'next/server';

interface DashboardStats {
  articles: {
    total: number;
    today: number;
    thisWeek: number;
    growth: number;
  };
  views: {
    total: number;
    today: number;
    thisWeek: number;
    growth: number;
  };
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    growth: number;
  };
  automation: {
    status: 'healthy' | 'warning' | 'error';
    lastRun: string;
    nextRun: string;
    successRate: number;
  };
}

interface ChartData {
  date: string;
  articles: number;
  views: number;
  revenue: number;
}

interface CategoryData {
  name: string;
  articles: number;
  views: number;
  revenue: number;
}

export async function GET(request: NextRequest) {
  try {
    // 실제로는 Strapi API에서 데이터를 가져와야 함
    const stats: DashboardStats = {
      articles: {
        total: 1247,
        today: 23,
        thisWeek: 156,
        growth: 12.5
      },
      views: {
        total: 45678,
        today: 1234,
        thisWeek: 8765,
        growth: 8.3
      },
      revenue: {
        total: 1234567,
        today: 45678,
        thisWeek: 234567,
        growth: 15.2
      },
      automation: {
        status: 'healthy',
        lastRun: '2024-01-15 14:30:00',
        nextRun: '2024-01-15 16:30:00',
        successRate: 94.5
      }
    };

    const chartData: ChartData[] = [
      { date: '2024-01-09', articles: 12, views: 1234, revenue: 12345 },
      { date: '2024-01-10', articles: 15, views: 1456, revenue: 14567 },
      { date: '2024-01-11', articles: 18, views: 1678, revenue: 16789 },
      { date: '2024-01-12', articles: 14, views: 1345, revenue: 13456 },
      { date: '2024-01-13', articles: 16, views: 1567, revenue: 15678 },
      { date: '2024-01-14', articles: 19, views: 1789, revenue: 17890 },
      { date: '2024-01-15', articles: 23, views: 1234, revenue: 12345 }
    ];

    const categoryData: CategoryData[] = [
      { name: '뉴스/시사', articles: 245, views: 12345, revenue: 123456 },
      { name: '기술/IT', articles: 189, views: 9876, revenue: 98765 },
      { name: '생활/건강', articles: 156, views: 7654, revenue: 76543 },
      { name: '엔터테인먼트', articles: 134, views: 6543, revenue: 65432 },
      { name: '경제/재테크', articles: 98, views: 5432, revenue: 54321 }
    ];

    return NextResponse.json({
      stats,
      chartData,
      categoryData
    });
  } catch (error) {
    console.error('대시보드 데이터 조회 실패:', error);
    return NextResponse.json(
      { error: '대시보드 데이터를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}
