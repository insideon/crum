import { NextRequest, NextResponse } from 'next/server';

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  source: 'frontend' | 'backend' | 'automation';
  url?: string;
  userAgent?: string;
  userId?: string;
  resolved: boolean;
}

interface ErrorStats {
  total: number;
  today: number;
  thisWeek: number;
  unresolved: number;
  byLevel: {
    error: number;
    warning: number;
    info: number;
  };
  bySource: {
    frontend: number;
    backend: number;
    automation: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    // 실제로는 로그 시스템에서 데이터를 가져와야 함
    const errors: ErrorLog[] = [
      {
        id: '1',
        timestamp: '2024-01-15T14:30:00Z',
        level: 'error',
        message: 'Failed to fetch articles from Strapi API',
        stack: 'Error: Network timeout\n    at fetch (/app/api/articles:45:12)\n    at async handler (/app/api/articles:23:8)',
        source: 'backend',
        url: '/api/articles',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        resolved: false
      },
      {
        id: '2',
        timestamp: '2024-01-15T13:45:00Z',
        level: 'warning',
        message: 'Slow API response detected',
        source: 'automation',
        url: '/api/trends',
        resolved: true
      },
      {
        id: '3',
        timestamp: '2024-01-15T12:20:00Z',
        level: 'error',
        message: 'OpenAI API rate limit exceeded',
        stack: 'Error: Rate limit exceeded\n    at OpenAI.generateContent (/app/services/contentGenerator:123:15)',
        source: 'automation',
        resolved: false
      },
      {
        id: '4',
        timestamp: '2024-01-15T11:15:00Z',
        level: 'info',
        message: 'Content generation completed successfully',
        source: 'automation',
        resolved: true
      },
      {
        id: '5',
        timestamp: '2024-01-15T10:30:00Z',
        level: 'warning',
        message: 'High memory usage detected',
        source: 'backend',
        resolved: false
      }
    ];

    const stats: ErrorStats = {
      total: errors.length,
      today: errors.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length,
      thisWeek: errors.filter(e => {
        const errorDate = new Date(e.timestamp);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return errorDate >= weekAgo;
      }).length,
      unresolved: errors.filter(e => !e.resolved).length,
      byLevel: {
        error: errors.filter(e => e.level === 'error').length,
        warning: errors.filter(e => e.level === 'warning').length,
        info: errors.filter(e => e.level === 'info').length
      },
      bySource: {
        frontend: errors.filter(e => e.source === 'frontend').length,
        backend: errors.filter(e => e.source === 'backend').length,
        automation: errors.filter(e => e.source === 'automation').length
      }
    };

    return NextResponse.json({
      errors,
      stats
    });
  } catch (error) {
    console.error('에러 데이터 조회 실패:', error);
    return NextResponse.json(
      { error: '에러 데이터를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}
