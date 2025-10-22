import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Article } from '@/lib/strapi';

interface HeroProps {
  latestArticle?: Article;
}

export function Hero({ latestArticle }: HeroProps) {
  return null; // 히어로 섹션 제거
}
