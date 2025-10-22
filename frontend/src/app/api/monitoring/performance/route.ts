import { NextRequest, NextResponse } from 'next/server';

interface PerformanceMetrics {
  pageLoad: {
    average: number;
    p95: number;
    p99: number;
    trend: number;
  };
  apiResponse: {
    average: number;
    p95: number;
    p99: number;
    trend: number;
  };
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
  };
  resourceUsage: {
    memory: number;
    cpu: number;
    disk: number;
    network: number;
  };
}

interface PerformanceData {
  timestamp: string;
  pageLoad: number;
  apiResponse: number;
  memory: number;
  cpu: number;
  requests: number;
  errors: number;
}

interface PagePerformance {
  page: string;
  loadTime: number;
  requests: number;
  size: number;
  score: number;
}

export async function GET(request: NextRequest) {
  try {
    // 실제로는 성능 모니터링 시스템에서 데이터를 가져와야 함
    const metrics: PerformanceMetrics = {
      pageLoad: {
        average: 1250,
        p95: 2100,
        p99: 3500,
        trend: -50
      },
      apiResponse: {
        average: 180,
        p95: 450,
        p99: 800,
        trend: -20
      },
      coreWebVitals: {
        lcp: 2100,
        fid: 85,
        cls: 0.08,
        fcp: 1200
      },
      resourceUsage: {
        memory: 65.2,
        cpu: 23.8,
        disk: 45.6,
        network: 12.4
      }
    };

    const chartData: PerformanceData[] = [
      { timestamp: '2024-01-15T00:00:00Z', pageLoad: 1200, apiResponse: 180, memory: 62, cpu: 25, requests: 1234, errors: 5 },
      { timestamp: '2024-01-15T04:00:00Z', pageLoad: 1180, apiResponse: 175, memory: 58, cpu: 22, requests: 1156, errors: 3 },
      { timestamp: '2024-01-15T08:00:00Z', pageLoad: 1350, apiResponse: 195, memory: 68, cpu: 28, requests: 1456, errors: 8 },
      { timestamp: '2024-01-15T12:00:00Z', pageLoad: 1280, apiResponse: 185, memory: 65, cpu: 24, requests: 1345, errors: 6 },
      { timestamp: '2024-01-15T16:00:00Z', pageLoad: 1220, apiResponse: 178, memory: 63, cpu: 23, requests: 1289, errors: 4 },
      { timestamp: '2024-01-15T20:00:00Z', pageLoad: 1300, apiResponse: 190, memory: 67, cpu: 26, requests: 1423, errors: 7 }
    ];

    const pagePerformance: PagePerformance[] = [
      { page: '/', loadTime: 1200, requests: 15, size: 245, score: 92 },
      { page: '/articles/[slug]', loadTime: 1350, requests: 8, size: 189, score: 88 },
      { page: '/category/[slug]', loadTime: 1100, requests: 12, size: 156, score: 95 },
      { page: '/search', loadTime: 1450, requests: 18, size: 298, score: 85 },
      { page: '/tag/[slug]', loadTime: 1280, requests: 10, size: 167, score: 90 }
    ];

    return NextResponse.json({
      metrics,
      chartData,
      pagePerformance
    });
  } catch (error) {
    console.error('성능 데이터 조회 실패:', error);
    return NextResponse.json(
      { error: '성능 데이터를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}
