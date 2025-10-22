import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale, AlertTriangle, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '이용약관 - Crum Blog',
  description: 'Crum Blog의 이용약관을 확인하세요.',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          홈으로 돌아가기
        </Link>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">이용약관</h1>
            <p className="text-muted-foreground mt-2">마지막 업데이트: 2025년 1월 1일</p>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 p-8 space-y-8">

          {/* 서문 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Scale className="h-6 w-6 mr-2 text-primary" />
              서문
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              본 이용약관은 Crum Blog(이하 "서비스")를 이용하는 모든 이용자에게 적용됩니다.
              서비스를 이용하시기 전에 본 약관을 자세히 읽어보시기 바랍니다.
              서비스 이용 시 본 약관에 동의하는 것으로 간주됩니다.
            </p>
          </section>

          {/* 서비스 소개 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-primary" />
              서비스 소개
            </h2>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-muted-foreground">
                Crum Blog는 데이터 기반 자동화 시스템을 통해 최신 트렌드와 정보를 제공하는
                블로그 서비스입니다. 다양한 카테고리의 콘텐츠를 통해 이용자에게 유용한 정보를 제공합니다.
              </p>
            </div>
          </section>

          {/* 이용자의 의무 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2 text-primary" />
              이용자의 의무
            </h2>
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">금지 행위</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-600 dark:text-red-400">
                  <li>서비스의 정상적인 운영을 방해하는 행위</li>
                  <li>다른 이용자의 개인정보를 무단으로 수집하거나 이용하는 행위</li>
                  <li>악성 프로그램을 유포하거나 시스템을 해킹하려는 행위</li>
                  <li>저작권을 침해하는 콘텐츠를 게시하는 행위</li>
                  <li>타인을 비방하거나 명예를 훼손하는 행위</li>
                  <li>상업적 목적으로 서비스를 이용하는 행위</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">준수 사항</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-600 dark:text-blue-400">
                  <li>정확한 정보 제공</li>
                  <li>서비스 이용 시 관련 법령 준수</li>
                  <li>다른 이용자에 대한 배려</li>
                  <li>건전한 인터넷 문화 조성</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 서비스 제공 및 변경 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">서비스 제공 및 변경</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">서비스 제공</h3>
                <p className="text-muted-foreground">
                  서비스는 연중무휴 24시간 제공을 원칙으로 하며, 시스템 점검 등 필요한 경우
                  사전 공지 후 일시적으로 중단될 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">서비스 변경</h3>
                <p className="text-muted-foreground">
                  서비스의 내용, 기능, 운영방식 등은 사전 공지 후 변경될 수 있으며,
                  이용자에게 불리한 변경의 경우 30일 전에 공지합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 지적재산권 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">지적재산권</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2">저작권</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>서비스에 게시된 모든 콘텐츠의 저작권은 Crum Blog에 귀속됩니다</li>
                <li>이용자는 서비스의 콘텐츠를 개인적 용도로만 이용할 수 있습니다</li>
                <li>상업적 이용, 복제, 배포, 수정 등은 사전 동의 없이 금지됩니다</li>
                <li>이용자가 게시한 댓글 등의 저작권은 이용자에게 귀속됩니다</li>
              </ul>
            </div>
          </section>

          {/* 면책조항 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">면책조항</h2>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2">서비스 이용</h3>
                <p className="text-sm text-muted-foreground">
                  이용자가 서비스를 이용하여 발생한 손해에 대해 Crum Blog는 고의 또는 중대한 과실이 없는 한
                  책임을 지지 않습니다.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2">제3자 콘텐츠</h3>
                <p className="text-sm text-muted-foreground">
                  서비스에 포함된 제3자 콘텐츠의 정확성, 신뢰성, 완전성에 대해 보장하지 않습니다.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2">시스템 장애</h3>
                <p className="text-sm text-muted-foreground">
                  시스템 장애, 네트워크 문제 등으로 인한 서비스 중단에 대해 책임을 지지 않습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 약관의 효력 및 변경 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">약관의 효력 및 변경</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">약관의 효력</h3>
                <p className="text-muted-foreground">
                  본 약관은 서비스 이용 시부터 효력을 발생하며, 이용자가 서비스를 계속 이용하는 경우
                  약관에 동의한 것으로 간주됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">약관의 변경</h3>
                <p className="text-muted-foreground">
                  본 약관은 필요에 따라 변경될 수 있으며, 변경 시 서비스 내 공지사항을 통해
                  사전에 안내드립니다. 중요한 변경사항의 경우 30일 전에 공지합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 분쟁 해결 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">분쟁 해결</h2>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">준거법 및 관할법원</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>본 약관은 대한민국 법률에 따라 해석됩니다</li>
                <li>서비스 이용과 관련한 분쟁은 대한민국 법원의 관할에 따릅니다</li>
                <li>분쟁 발생 시 먼저 협의를 통해 해결을 시도합니다</li>
              </ul>
            </div>
          </section>

          {/* 연락처 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary" />
              연락처
            </h2>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="space-y-2">
                <p><span className="font-semibold">서비스명:</span> Crum Blog</p>
                <p><span className="font-semibold">운영팀:</span> Crum Blog 운영팀</p>
                <p><span className="font-semibold">연락처:</span> contact@loofend.com</p>
                <p className="text-sm text-muted-foreground">
                  서비스 이용과 관련한 문의사항이 있으시면 언제든 연락주시기 바랍니다.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* 하단 액션 */}
      <div className="mt-8 flex justify-center">
        <Link href="/">
          <Button className="px-8">
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
