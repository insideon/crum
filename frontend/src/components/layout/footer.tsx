import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span className="font-bold">Crum Blog</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              데이터 기반 자동화 블로그로 최신 트렌드와 정보를 제공합니다.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">카테고리</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/news" className="text-muted-foreground hover:text-foreground transition-colors">
                  뉴스/시사
                </Link>
              </li>
              <li>
                <Link href="/category/tech" className="text-muted-foreground hover:text-foreground transition-colors">
                  기술/IT
                </Link>
              </li>
              <li>
                <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">
                  경제/재테크
                </Link>
              </li>
              <li>
                <Link href="/category/lifestyle" className="text-muted-foreground hover:text-foreground transition-colors">
                  생활/건강
                </Link>
              </li>
              <li>
                <Link href="/category/entertainment" className="text-muted-foreground hover:text-foreground transition-colors">
                  엔터테인먼트
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="text-muted-foreground hover:text-foreground transition-colors">
                  스포츠
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">법적 고지</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">
                  면책조항
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">연락처</h3>
            <div className="text-sm text-muted-foreground">
              <p>이메일: contact@crum.blog</p>
              <p>문의사항이 있으시면 언제든 연락주세요.</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Crum Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
