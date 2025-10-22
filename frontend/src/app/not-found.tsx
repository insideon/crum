import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            {/* 404 아이콘 */}
            <div className="mb-6">
              <div className="text-6xl font-bold text-primary mb-2">404</div>
              <div className="text-2xl font-semibold text-gray-700 mb-2">
                페이지를 찾을 수 없습니다
              </div>
              <p className="text-gray-500">
                요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
              </p>
            </div>

            {/* 액션 버튼들 */}
            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full" size="lg">
                  <Home className="h-4 w-4 mr-2" />
                  홈으로 돌아가기
                </Button>
              </Link>
              
              <Link href="/search" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  검색하기
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                className="w-full" 
                size="lg"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                이전 페이지로
              </Button>
            </div>

            {/* 도움말 섹션 */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-3">도움이 필요하신가요?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• URL을 다시 확인해보세요</p>
                <p>• 검색 기능을 이용해 원하는 내용을 찾아보세요</p>
                <p>• 홈페이지에서 최신 게시글을 확인해보세요</p>
              </div>
            </div>

            {/* 인기 링크 */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">인기 카테고리</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link href="/category/news" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  뉴스/시사
                </Link>
                <Link href="/category/tech" className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  기술/IT
                </Link>
                <Link href="/category/lifestyle" className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  생활
                </Link>
                <Link href="/category/entertainment" className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                  엔터테인먼트
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
