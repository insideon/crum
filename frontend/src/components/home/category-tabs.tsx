import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/lib/strapi';

interface CategoryTabsProps {
  categories: Category[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">카테고리</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
              {category.icon && <span className="mr-2">{category.icon}</span>}
              {category.name}
              {category.articles && (
                <span className="ml-2 text-xs opacity-70">
                  ({category.articles.length})
                </span>
              )}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
