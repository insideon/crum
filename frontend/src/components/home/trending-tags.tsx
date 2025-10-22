import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Hash, TrendingUp, Zap } from 'lucide-react';
import { Tag } from '@/lib/strapi';

interface TrendingTagsProps {
  tags: Tag[];
}

export function TrendingTags({ tags }: TrendingTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 gradient-text">인기 태그</h2>
          <p className="text-muted-foreground">지금 가장 핫한 키워드들</p>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium text-primary">실시간 트렌드</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 p-8">
        <div className="flex flex-wrap gap-3 mb-6">
          {tags.slice(0, 8).map((tag, index) => (
            <Link key={tag.id} href={`/tag/${tag.slug}`}>
              <Badge
                variant={index < 3 ? "default" : "secondary"}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 cursor-pointer ${
                  index < 3
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70'
                    : 'hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                <Hash className="h-3 w-3 mr-1" />
                {tag.name}
                <span className="ml-2 text-xs opacity-80">({tag.count})</span>
              </Badge>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">
              실시간으로 업데이트되는 인기 키워드
            </span>
          </div>
          <Link href="/tags">
            <Button variant="outline" size="sm" className="group">
              모든 태그 보기
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
