'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Zap, 
  Clock, 
  HardDrive, 
  Wifi, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';

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

export function PerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [chartData, setChartData] = useState<PerformanceData[]>([]);
  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000); // 30초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/monitoring/performance');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setChartData(data.chartData);
        setPagePerformance(data.pagePerformance);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('성능 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">우수</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">보통</Badge>;
    return <Badge className="bg-red-100 text-red-800">개선 필요</Badge>;
  };

  const getCoreWebVitalScore = (value: number, type: 'lcp' | 'fid' | 'cls' | 'fcp') => {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 }
    };

    const threshold = thresholds[type];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getCoreWebVitalColor = (score: string) => {
    switch (score) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <h1 className="text-3xl font-bold">성능 모니터링</h1>
          <p className="text-muted-foreground">
            웹사이트 성능 및 Core Web Vitals 추적
          </p>
        </div>
        <Button onClick={fetchPerformanceData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 주요 메트릭 */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">페이지 로드 시간</p>
                  <p className="text-2xl font-bold">{metrics.pageLoad.average.toFixed(0)}ms</p>
                  <div className="flex items-center mt-1">
                    {metrics.pageLoad.trend >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span className={`text-sm ${metrics.pageLoad.trend >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {Math.abs(metrics.pageLoad.trend)}ms
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">API 응답 시간</p>
                  <p className="text-2xl font-bold">{metrics.apiResponse.average.toFixed(0)}ms</p>
                  <div className="flex items-center mt-1">
                    {metrics.apiResponse.trend >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span className={`text-sm ${metrics.apiResponse.trend >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {Math.abs(metrics.apiResponse.trend)}ms
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">메모리 사용량</p>
                  <p className="text-2xl font-bold">{metrics.resourceUsage.memory.toFixed(1)}%</p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <HardDrive className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">네트워크 사용량</p>
                  <p className="text-2xl font-bold">{metrics.resourceUsage.network.toFixed(1)}%</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Wifi className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Core Web Vitals */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Core Web Vitals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">LCP</p>
                <p className={`text-2xl font-bold ${getCoreWebVitalColor(getCoreWebVitalScore(metrics.coreWebVitals.lcp, 'lcp'))}`}>
                  {metrics.coreWebVitals.lcp.toFixed(0)}ms
                </p>
                <p className="text-xs text-muted-foreground mt-1">Largest Contentful Paint</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">FID</p>
                <p className={`text-2xl font-bold ${getCoreWebVitalColor(getCoreWebVitalScore(metrics.coreWebVitals.fid, 'fid'))}`}>
                  {metrics.coreWebVitals.fid.toFixed(0)}ms
                </p>
                <p className="text-xs text-muted-foreground mt-1">First Input Delay</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">CLS</p>
                <p className={`text-2xl font-bold ${getCoreWebVitalColor(getCoreWebVitalScore(metrics.coreWebVitals.cls, 'cls'))}`}>
                  {metrics.coreWebVitals.cls.toFixed(3)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Cumulative Layout Shift</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">FCP</p>
                <p className={`text-2xl font-bold ${getCoreWebVitalColor(getCoreWebVitalScore(metrics.coreWebVitals.fcp, 'fcp'))}`}>
                  {metrics.coreWebVitals.fcp.toFixed(0)}ms
                </p>
                <p className="text-xs text-muted-foreground mt-1">First Contentful Paint</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 성능 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>성능 트렌드</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="pageLoad" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="apiResponse" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>리소스 사용량</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="memory" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="cpu" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 페이지별 성능 */}
      <Card>
        <CardHeader>
          <CardTitle>페이지별 성능</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pagePerformance.map((page) => (
              <div key={page.page} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{page.page}</p>
                    <p className="text-sm text-muted-foreground">
                      {page.loadTime}ms • {page.requests} requests • {(page.size / 1024).toFixed(1)}KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getScoreBadge(page.score)}
                  <span className={`text-lg font-bold ${getScoreColor(page.score)}`}>
                    {page.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
