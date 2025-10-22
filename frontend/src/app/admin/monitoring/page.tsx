'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonitoringDashboard } from '@/components/monitoring/dashboard';
import { ErrorTracking } from '@/components/monitoring/error-tracking';
import { PerformanceMonitoring } from '@/components/monitoring/performance';
import { BarChart3, Bug, Zap, Settings } from 'lucide-react';

export default function MonitoringPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">시스템 모니터링</h1>
        <p className="text-muted-foreground">
          Crum Blog 시스템의 전반적인 상태를 모니터링하고 관리합니다.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>대시보드</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>성능</span>
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center space-x-2">
            <Bug className="h-4 w-4" />
            <span>에러 추적</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>설정</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <MonitoringDashboard />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceMonitoring />
        </TabsContent>

        <TabsContent value="errors">
          <ErrorTracking />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>모니터링 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">알림 설정</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">에러 알림</p>
                        <p className="text-sm text-muted-foreground">시스템 에러 발생 시 알림</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">성능 알림</p>
                        <p className="text-sm text-muted-foreground">성능 임계값 초과 시 알림</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">자동화 알림</p>
                        <p className="text-sm text-muted-foreground">자동화 작업 실패 시 알림</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">데이터 보존</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">로그 보존 기간</p>
                        <p className="text-sm text-muted-foreground">에러 로그 보존 기간</p>
                      </div>
                      <select className="p-2 border rounded">
                        <option value="7">7일</option>
                        <option value="30" selected>30일</option>
                        <option value="90">90일</option>
                        <option value="365">1년</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">성능 데이터 보존 기간</p>
                        <p className="text-sm text-muted-foreground">성능 메트릭 보존 기간</p>
                      </div>
                      <select className="p-2 border rounded">
                        <option value="30">30일</option>
                        <option value="90" selected>90일</option>
                        <option value="180">6개월</option>
                        <option value="365">1년</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">임계값 설정</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">페이지 로드 시간 임계값</p>
                        <p className="text-sm text-muted-foreground">경고 알림을 위한 임계값</p>
                      </div>
                      <input type="number" defaultValue="2000" className="p-2 border rounded w-20" /> ms
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">API 응답 시간 임계값</p>
                        <p className="text-sm text-muted-foreground">경고 알림을 위한 임계값</p>
                      </div>
                      <input type="number" defaultValue="500" className="p-2 border rounded w-20" /> ms
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">메모리 사용률 임계값</p>
                        <p className="text-sm text-muted-foreground">경고 알림을 위한 임계값</p>
                      </div>
                      <input type="number" defaultValue="80" className="p-2 border rounded w-20" /> %
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
                    설정 저장
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
