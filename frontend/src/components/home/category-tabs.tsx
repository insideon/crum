import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Category } from '@/lib/strapi';

interface CategoryTabsProps {
  categories: Category[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 gradient-text">카테고리</h2>
          <p className="text-muted-foreground">관심 있는 주제를 선택해보세요</p>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">인기 카테고리</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift">
              <div className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-lg">{category.icon}</span>
                </div>

                <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                  {category.name}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              </div>

              {/* 호버 효과 */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
