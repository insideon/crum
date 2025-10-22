'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CrumLogo } from '@/components/ui/crum-logo';
import { Search, Menu, TrendingUp, ChevronDown, Grid3X3 } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const categories = [
    { name: '뉴스/시사', slug: 'news', icon: '📰' },
    { name: '기술/IT', slug: 'tech', icon: '💻' },
    { name: '경제/재테크', slug: 'finance', icon: '💰' },
    { name: '생활/건강', slug: 'lifestyle', icon: '🏠' },
    { name: '엔터테인먼트', slug: 'entertainment', icon: '🎬' },
    { name: '스포츠', slug: 'sports', icon: '⚽' },
    { name: '여행/문화', slug: 'travel', icon: '✈️' },
    { name: '요리/맛집', slug: 'food', icon: '🍳' },
    { name: '패션/뷰티', slug: 'fashion', icon: '👗' },
    { name: '교육/학습', slug: 'education', icon: '📚' },
    { name: '자동차', slug: 'automotive', icon: '🚗' },
    { name: '부동산', slug: 'real-estate', icon: '🏘️' },
    { name: '반려동물', slug: 'pets', icon: '🐕' },
    { name: '육아/가족', slug: 'family', icon: '👶' },
    { name: '환경/에너지', slug: 'environment', icon: '🌱' },
    { name: '과학/연구', slug: 'science', icon: '🔬' },
    { name: '정치/사회', slug: 'politics', icon: '🏛️' },
    { name: '국제', slug: 'international', icon: '🌍' },
    { name: '취업/직장', slug: 'career', icon: '💼' },
    { name: '기타', slug: 'etc', icon: '📋' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <CrumLogo size="lg" className="group-hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-bold text-xl gradient-text">Crum Blog</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="relative text-sm font-medium transition-colors hover:text-primary group"
            >
              홈
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/articles"
              className="relative text-sm font-medium transition-colors hover:text-primary group"
            >
              모든 게시글
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/tags"
              className="relative text-sm font-medium transition-colors hover:text-primary group"
            >
              모든 태그
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary group"
              >
                <Grid3X3 className="h-4 w-4" />
                <span>카테고리</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>

              {isCategoryOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsCategoryOpen(false)}
                  />

                  {/* Dropdown */}
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/category/${category.slug}`}
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm font-medium">{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-72 h-10 rounded-xl border-border/50 focus:border-primary/50 transition-all duration-300"
                />
              </div>
              <Button type="submit" size="sm" className="h-10 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300">
                검색
              </Button>
            </form>


            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-10 w-10 rounded-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-6 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80">
                검색
              </Button>
            </form>

            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="flex items-center space-x-3 text-sm font-medium transition-colors hover:text-primary py-3 px-4 rounded-xl hover:bg-accent/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                홈
              </Link>
              <Link
                href="/articles"
                className="flex items-center space-x-3 text-sm font-medium transition-colors hover:text-primary py-3 px-4 rounded-xl hover:bg-accent/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                모든 게시글
              </Link>
              <Link
                href="/tags"
                className="flex items-center space-x-3 text-sm font-medium transition-colors hover:text-primary py-3 px-4 rounded-xl hover:bg-accent/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                모든 태그
              </Link>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground px-4 py-2">카테고리</div>
                <div className="grid grid-cols-2 gap-2 px-4">
                  {categories.slice(0, 8).map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <span className="text-sm">{category.icon}</span>
                      <span className="text-xs font-medium">{category.name}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/category"
                  className="flex items-center justify-center space-x-2 text-sm font-medium text-primary py-2 px-4 rounded-xl hover:bg-accent/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>모든 카테고리 보기</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
