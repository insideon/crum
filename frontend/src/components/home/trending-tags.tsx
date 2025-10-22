import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Tag } from '@/lib/strapi';

interface TrendingTagsProps {
  tags: Tag[];
}

export function TrendingTags({ tags }: TrendingTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">인기 태그</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/tag/${tag.slug}`}>
            <Badge
              variant="secondary"
              className="px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
              #{tag.name}
              <span className="ml-1 text-xs opacity-70">({tag.count})</span>
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
