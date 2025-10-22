import Link from 'next/link';
import { CrumLogo } from '@/components/ui/crum-logo';

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-br from-slate-50/50 to-slate-100/30 dark:from-slate-900/50 dark:to-slate-800/30">
      <div className="container mx-auto px-4 py-16">
        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <div className="flex items-center space-x-3 group-hover:scale-105 transition-transform duration-300">
                <CrumLogo size="xl" />
                <div className="flex flex-col">
                  <span className="font-bold text-xl gradient-text">Crum Blog</span>
                  <span className="text-sm text-muted-foreground">최신 트렌드와 정보</span>
                </div>
              </div>
            </Link>

            <p className="text-muted-foreground leading-relaxed text-sm max-w-sm">
              데이터 기반 자동화 블로그로 최신 트렌드와 정보를 제공합니다.
            </p>
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Contact</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">이메일</p>
                <a
                  href="mailto:contact@loofend.com"
                  className="text-foreground font-medium hover:text-primary transition-colors duration-300"
                >
                  contact@loofend.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              <p>&copy; 2025 Crum Blog. All rights reserved.</p>
            </div>

            {/* 추가 정보 */}
            <div className="text-xs text-muted-foreground">
              Made with ❤️ for better content discovery
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
