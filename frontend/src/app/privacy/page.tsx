import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Lock, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '개인정보처리방침 - Crum Blog',
  description: 'Crum Blog의 개인정보처리방침을 확인하세요.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          홈으로 돌아가기
        </Link>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">개인정보처리방침</h1>
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
              <Eye className="h-6 w-6 mr-2 text-primary" />
              서문
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Crum Blog(이하 "서비스")는 이용자의 개인정보를 소중히 여기며, 개인정보보호법 및 관련 법령에 따라
              이용자의 개인정보를 보호하고 관리하기 위해 최선을 다하고 있습니다. 본 개인정보처리방침은
              서비스 이용 시 수집되는 개인정보의 처리 목적, 방법, 보유기간 등에 대해 안내합니다.
            </p>
          </section>

          {/* 수집하는 개인정보 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Database className="h-6 w-6 mr-2 text-primary" />
              수집하는 개인정보
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">자동 수집 정보</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>IP 주소, 브라우저 정보, 운영체제 정보</li>
                  <li>접속 일시, 페이지 방문 기록</li>
                  <li>쿠키 및 유사 기술을 통한 이용 패턴 정보</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">선택적 수집 정보</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>이메일 주소 (뉴스레터 구독 시)</li>
                  <li>댓글 작성 시 입력하는 정보</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 개인정보 처리 목적 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <UserCheck className="h-6 w-6 mr-2 text-primary" />
              개인정보 처리 목적
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>서비스 제공 및 운영</li>
              <li>이용자 맞춤형 콘텐츠 제공</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
              <li>통계 분석 및 트렌드 파악</li>
              <li>고객 상담 및 문의 응답</li>
            </ul>
          </section>

          {/* 개인정보 보유기간 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Lock className="h-6 w-6 mr-2 text-primary" />
              개인정보 보유기간
            </h2>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2">자동 수집 정보</h3>
                <p className="text-muted-foreground">서비스 이용 종료 시 즉시 삭제 (단, 통계 목적으로 익명화된 정보는 보관)</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2">뉴스레터 구독 정보</h3>
                <p className="text-muted-foreground">구독 해지 시 즉시 삭제</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2">댓글 정보</h3>
                <p className="text-muted-foreground">댓글 삭제 시 즉시 삭제</p>
              </div>
            </div>
          </section>

          {/* 개인정보 제3자 제공 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">개인정보 제3자 제공</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-muted-foreground">
                Crum Blog는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
                다만, 다음의 경우에는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </div>
          </section>

          {/* 개인정보 보호를 위한 기술적/관리적 대책 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">개인정보 보호를 위한 기술적/관리적 대책</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2">기술적 대책</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>SSL/TLS 암호화 통신</li>
                  <li>방화벽 및 침입차단시스템 운영</li>
                  <li>정기적인 보안 점검</li>
                </ul>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2">관리적 대책</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>개인정보보호 교육 실시</li>
                  <li>접근 권한 관리</li>
                  <li>개인정보 처리 현황 점검</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 이용자 권리 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">이용자 권리</h2>
            <p className="text-muted-foreground mb-4">
              이용자는 언제든지 다음의 권리를 행사할 수 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>개인정보 처리 현황에 대한 열람 요구</li>
              <li>개인정보의 정정·삭제 요구</li>
              <li>개인정보 처리정지 요구</li>
              <li>개인정보보호위원회에 대한 개인정보보호법 위반 신고</li>
            </ul>
          </section>

          {/* 개인정보보호책임자 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">개인정보보호책임자</h2>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="space-y-2">
                <p><span className="font-semibold">책임자:</span> Crum Blog 운영팀</p>
                <p><span className="font-semibold">연락처:</span> contact@loofend.com</p>
                <p className="text-sm text-muted-foreground">
                  개인정보 처리에 관한 불만이나 문의사항이 있으시면 언제든 연락주시기 바랍니다.
                </p>
              </div>
            </div>
          </section>

          {/* 개인정보처리방침 변경 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">개인정보처리방침 변경</h2>
            <p className="text-muted-foreground">
              본 개인정보처리방침은 관련 법령 및 지침의 변경 또는 서비스 정책의 변경에 따라
              수정될 수 있습니다. 변경 시에는 서비스 내 공지사항을 통해 사전에 안내드리겠습니다.
            </p>
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
