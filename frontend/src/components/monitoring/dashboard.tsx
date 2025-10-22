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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

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

export function MonitoringDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // 30초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/monitoring/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setChartData(data.chartData);
        setCategoryData(data.categoryData);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
          <h1 className="text-3xl font-bold">모니터링 대시보드</h1>
          <p className="text-muted-foreground">
            마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 주요 통계 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">총 게시글</p>
                  <p className="text-2xl font-bold">{stats.articles.total.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    {stats.articles.growth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stats.articles.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats.articles.growth)}%
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">총 조회수</p>
                  <p className="text-2xl font-bold">{stats.views.total.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    {stats.views.growth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stats.views.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats.views.growth)}%
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Eye className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">총 수익</p>
                  <p className="text-2xl font-bold">₩{stats.revenue.total.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    {stats.revenue.growth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stats.revenue.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats.revenue.growth)}%
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">자동화 상태</p>
                  <div className="flex items-center mt-1">
                    {getStatusIcon(stats.automation.status)}
                    <span className="ml-2 text-sm font-medium capitalize">
                      {stats.automation.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    성공률: {stats.automation.successRate}%
                  </p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 일별 트렌드 */}
        <Card>
          <CardHeader>
            <CardTitle>일별 트렌드</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="articles" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="views" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 카테고리별 분포 */}
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 게시글 수</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="articles"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 자동화 시스템 상태 */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>자동화 시스템 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${getStatusColor(stats.automation.status)}`} />
                <p className="text-sm font-medium">현재 상태</p>
                <p className="text-xs text-muted-foreground capitalize">{stats.automation.status}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">마지막 실행</p>
                <p className="text-xs text-muted-foreground">{stats.automation.lastRun}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">다음 실행</p>
                <p className="text-xs text-muted-foreground">{stats.automation.nextRun}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
