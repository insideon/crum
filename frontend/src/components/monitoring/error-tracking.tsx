'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Bug, 
  Clock, 
  RefreshCw, 
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';

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

export function ErrorTracking() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [stats, setStats] = useState<ErrorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    level: 'all',
    source: 'all',
    resolved: 'all',
    search: ''
  });

  useEffect(() => {
    fetchErrorData();
    const interval = setInterval(fetchErrorData, 10000); // 10초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  const fetchErrorData = async () => {
    try {
      const response = await fetch('/api/monitoring/errors');
      if (response.ok) {
        const data = await response.json();
        setErrors(data.errors);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('에러 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveError = async (errorId: string) => {
    try {
      const response = await fetch(`/api/monitoring/errors/${errorId}/resolve`, {
        method: 'POST'
      });
      if (response.ok) {
        setErrors(prev => prev.map(error => 
          error.id === errorId ? { ...error, resolved: true } : error
        ));
      }
    } catch (error) {
      console.error('에러 해결 실패:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'warning': return <Badge variant="secondary">Warning</Badge>;
      case 'info': return <Badge variant="outline">Info</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'frontend': return <Badge variant="outline">Frontend</Badge>;
      case 'backend': return <Badge variant="outline">Backend</Badge>;
      case 'automation': return <Badge variant="outline">Automation</Badge>;
      default: return <Badge variant="outline">{source}</Badge>;
    }
  };

  const filteredErrors = errors.filter(error => {
    if (filter.level !== 'all' && error.level !== filter.level) return false;
    if (filter.source !== 'all' && error.source !== filter.source) return false;
    if (filter.resolved !== 'all') {
      const isResolved = filter.resolved === 'resolved';
      if (error.resolved !== isResolved) return false;
    }
    if (filter.search && !error.message.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-8 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">에러 추적</h1>
          <p className="text-muted-foreground">
            시스템 에러 및 예외 상황 모니터링
          </p>
        </div>
        <Button onClick={fetchErrorData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 통계 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">총 에러</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Bug className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">오늘</p>
                  <p className="text-2xl font-bold">{stats.today}</p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">미해결</p>
                  <p className="text-2xl font-bold text-red-600">{stats.unresolved}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">이번 주</p>
                  <p className="text-2xl font-bold">{stats.thisWeek}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">레벨</label>
              <select 
                value={filter.level} 
                onChange={(e) => setFilter(prev => ({ ...prev, level: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="all">전체</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">소스</label>
              <select 
                value={filter.source} 
                onChange={(e) => setFilter(prev => ({ ...prev, source: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="all">전체</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="automation">Automation</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">상태</label>
              <select 
                value={filter.resolved} 
                onChange={(e) => setFilter(prev => ({ ...prev, resolved: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="all">전체</option>
                <option value="unresolved">미해결</option>
                <option value="resolved">해결됨</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">검색</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="에러 메시지 검색..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 에러 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>에러 로그 ({filteredErrors.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredErrors.length === 0 ? (
              <div className="text-center py-8">
                <Bug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">에러가 없습니다.</p>
              </div>
            ) : (
              filteredErrors.map((error) => (
                <div key={error.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getLevelBadge(error.level)}
                      {getSourceBadge(error.source)}
                      {error.resolved && <Badge variant="outline">해결됨</Badge>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(error.timestamp).toLocaleString('ko-KR')}
                      </span>
                      {!error.resolved && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => resolveError(error.id)}
                        >
                          해결
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium mb-2">{error.message}</p>
                  
                  {error.url && (
                    <div className="flex items-center space-x-2 mb-2">
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{error.url}</span>
                    </div>
                  )}
                  
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer">
                        스택 트레이스 보기
                      </summary>
                      <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
