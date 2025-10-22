'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Menu, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl gradient-text">Crum Blog</span>
              <span className="text-xs text-muted-foreground font-medium">AI-Powered</span>
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
              href="/category/news"
              className="relative text-sm font-medium transition-colors hover:text-primary group"
            >
              뉴스/시사
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/category/tech"
              className="relative text-sm font-medium transition-colors hover:text-primary group"
            >
              기술/IT
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/category/lifestyle"
              className="relative text-sm font-medium transition-colors hover:text-primary group"
            >
              생활
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/category/entertainment"
              className="relative text-sm font-medium transition-colors hover:text-primary group"
            >
              엔터테인먼트
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
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

            {/* Trending Badge */}
            <div className="hidden lg:flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <Badge variant="secondary" className="text-xs font-medium">
                실시간 트렌드
              </Badge>
            </div>

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
                href="/category/news"
                className="flex items-center space-x-3 text-sm font-medium transition-colors hover:text-primary py-3 px-4 rounded-xl hover:bg-accent/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                뉴스/시사
              </Link>
              <Link
                href="/category/tech"
                className="flex items-center space-x-3 text-sm font-medium transition-colors hover:text-primary py-3 px-4 rounded-xl hover:bg-accent/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                기술/IT
              </Link>
              <Link
                href="/category/lifestyle"
                className="flex items-center space-x-3 text-sm font-medium transition-colors hover:text-primary py-3 px-4 rounded-xl hover:bg-accent/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                생활
              </Link>
              <Link
                href="/category/entertainment"
                className="flex items-center space-x-3 text-sm font-medium transition-colors hover:text-primary py-3 px-4 rounded-xl hover:bg-accent/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                엔터테인먼트
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
