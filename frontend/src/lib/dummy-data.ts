import type { Article, Category, Tag } from './strapi';

// 더미 데이터 생성을 위한 템플릿
const titleTemplates = [
  '{year}년 {topic} 트렌드 분석',
  '{topic}의 미래: 전문가가 말하는 5가지 전망',
  '{topic} 초보자를 위한 완벽 가이드',
  '성공적인 {topic} 전략 10가지',
  '{topic}로 수익 창출하는 방법',
  '{topic} 업계 최신 동향',
  '{topic} vs {topic2}: 무엇을 선택해야 할까?',
  '{topic}의 놀라운 활용 사례',
  '전문가가 추천하는 {topic} 베스트 프랙티스',
  '{topic} 시장 분석 리포트',
  '{topic} 입문자가 꼭 알아야 할 사항',
  '{topic}로 생산성을 높이는 방법',
  '{topic} 관련 최신 연구 결과',
  '{topic} 산업의 혁신 사례',
  '{topic} 실전 활용 팁',
];

const topics = [
  'AI', '머신러닝', '딥러닝', '블록체인', 'NFT', '메타버스', 'Web3',
  '클라우드', 'DevOps', '마이크로서비스', 'Kubernetes', 'Docker',
  'React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'Node.js',
  '파이썬', '자바', 'Go', 'Rust', 'Swift', 'Kotlin',
  '데이터 분석', '빅데이터', '데이터 시각화', 'SQL', 'NoSQL',
  '사이버보안', '정보보안', '해킹', '취약점',
  '스타트업', '창업', '투자', '펀딩', 'VC',
  '마케팅', 'SEO', 'SNS 마케팅', '콘텐츠 마케팅', '그로스 해킹',
  '재택근무', '원격근무', '업무 효율', '생산성', '시간관리',
  '건강', '운동', '다이어트', '요가', '명상',
  '요리', '레시피', '베이킹', '카페',
  '여행', '배낭여행', '호텔', '항공권',
  '영화', '드라마', 'K-POP', '음악', '공연',
  '게임', 'e-스포츠', '스트리밍',
  '부동산', '재테크', '주식', '암호화폐', '경제',
  '자동차', '전기차', '자율주행',
  '패션', '뷰티', '화장품', '스타일링',
  '육아', '교육', '온라인 강의',
  '반려동물', '반려견', '반려묘',
];

const contentTemplates = [
  `# {title}에 대한 심층 분석

최근 {topic} 분야가 빠르게 성장하고 있습니다. 이 글에서는 {topic}의 현황과 미래 전망을 살펴봅니다.

## 현재 상황

{topic}은 현재 많은 관심을 받고 있으며, 다양한 산업 분야에서 활용되고 있습니다.

## 주요 특징

- 혁신적인 접근 방식
- 사용자 친화적인 인터페이스
- 높은 확장성과 유연성
- 비용 효율적인 솔루션

## 실전 활용 방법

실제 업무나 프로젝트에서 {topic}을 효과적으로 활용하는 방법을 소개합니다.

## 향후 전망

전문가들은 {topic}이 앞으로 더욱 발전할 것으로 예상하고 있습니다.`,

  `# {title} 완벽 가이드

{topic}을 처음 접하는 분들을 위한 종합 가이드입니다.

## 기본 개념

{topic}의 기본적인 개념과 원리를 이해하기 쉽게 설명합니다.

## 시작하기

초보자도 쉽게 따라할 수 있는 단계별 가이드를 제공합니다.

## 유용한 팁

실무 경험을 바탕으로 한 실용적인 팁들을 공유합니다.

## 자주 묻는 질문

많은 분들이 궁금해하는 내용들을 정리했습니다.`,

  `# {title}: 전문가의 조언

{topic} 분야의 전문가들이 공유하는 인사이트와 노하우입니다.

## 핵심 포인트

성공을 위해 반드시 알아야 할 핵심 요소들을 정리했습니다.

## 실패 사례 분석

실패에서 배우는 교훈들을 살펴봅니다.

## 성공 전략

검증된 성공 전략과 방법론을 소개합니다.

## 실행 계획

구체적인 실행 계획 수립 방법을 안내합니다.`,
];

const excerptTemplates = [
  '{topic}의 최신 동향과 핵심 인사이트를 전문가의 시각으로 분석합니다.',
  '{topic}에 대한 실용적인 가이드와 활용 팁을 상세히 소개합니다.',
  '{topic} 분야의 혁신 사례와 성공 전략을 공유합니다.',
  '{topic}을 효과적으로 활용하는 방법을 단계별로 설명합니다.',
  '{topic}의 현황과 미래 전망을 심층적으로 다룹니다.',
];

const unsplashImageIds = [
  'photo-1677442136019-21780ecad995', 'photo-1633356122544-f134324a6cee',
  'photo-1519389950473-47ba0277781c', 'photo-1440404653325-ab127d49abc1',
  'photo-1639762681485-074b7f938ba0', 'photo-1556761175-b413da4baf72',
  'photo-1460925895917-afdab827c52f', 'photo-1490645935967-10de6ba17061',
  'photo-1526170375885-4d8ecf77b99f', 'photo-1505740420928-5e560c06d30e',
  'photo-1523275335684-37898b6baf30', 'photo-1572635196237-14b3f281503f',
  'photo-1487058792275-0ad4aaf24ca7', 'photo-1498050108023-c5249f4df085',
  'photo-1550439062-609e1531270e', 'photo-1451187580459-43490279c0fa',
  'photo-1484788984921-03950022c9ef', 'photo-1504384308090-c894fdcc538d',
  'photo-1496181133206-80ce9b88a853', 'photo-1517694712202-14dd9538aa97',
];

// 더미 카테고리 데이터
export const dummyCategories: Category[] = [
  {
    id: 1,
    name: '뉴스/시사',
    slug: 'news',
    description: '최신 뉴스와 시사 이슈',
    icon: '📰',
    order: 1
  },
  {
    id: 2,
    name: '기술/IT',
    slug: 'tech',
    description: '기술 트렌드와 IT 정보',
    icon: '💻',
    order: 2
  },
  {
    id: 3,
    name: '생활',
    slug: 'lifestyle',
    description: '일상 생활 정보와 팁',
    icon: '🏠',
    order: 3
  },
  {
    id: 4,
    name: '엔터테인먼트',
    slug: 'entertainment',
    description: '문화, 영화, 음악 등',
    icon: '🎬',
    order: 4
  }
];

// 더미 태그 데이터
export const dummyTags: Tag[] = [
  { id: 1, name: 'AI', slug: 'ai', count: 15 },
  { id: 2, name: '개발', slug: 'development', count: 12 },
  { id: 3, name: '블록체인', slug: 'blockchain', count: 8 },
  { id: 4, name: '스타트업', slug: 'startup', count: 10 },
  { id: 5, name: '디자인', slug: 'design', count: 7 },
  { id: 6, name: '마케팅', slug: 'marketing', count: 9 },
  { id: 7, name: '건강', slug: 'health', count: 11 },
  { id: 8, name: '여행', slug: 'travel', count: 6 },
  { id: 9, name: '요리', slug: 'cooking', count: 5 },
  { id: 10, name: '경제', slug: 'economy', count: 13 }
];

// 시더블 랜덤 생성기
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

// slug 생성 함수
function generateSlug(title: string, id: number): string {
  // 한글을 영문으로 변환하는 간단한 매핑
  const koreanToEnglish: { [key: string]: string } = {
    '업계': 'industry',
    '최신': 'latest',
    '동향': 'trends',
    '초보자': 'beginner',
    '완벽': 'complete',
    '가이드': 'guide',
    '실전': 'practical',
    '활용': 'application',
    '팁': 'tips',
    '입문자': 'starter',
    '알아야': 'know',
    '사항': 'things',
    '놀라운': 'amazing',
    '사례': 'cases',
    '전문가': 'expert',
    '추천': 'recommend',
    '베스트': 'best',
    '프랙티스': 'practices',
    '시장': 'market',
    '분석': 'analysis',
    '리포트': 'report',
    '생산성': 'productivity',
    '높이는': 'boost',
    '방법': 'method',
    '연구': 'research',
    '결과': 'results',
    '산업': 'industry',
    '혁신': 'innovation',
    '트렌드': 'trends',
    '미래': 'future',
    '전망': 'outlook',
    '성공': 'success',
    '전략': 'strategy',
    '수익': 'profit',
    '창출': 'generation',
    'vs': 'vs',
    '선택': 'choice',
    '해야': 'should',
    '할까': 'choose',
    '관련': 'related',
    'AI': 'ai',
    '머신러닝': 'machine-learning',
    '딥러닝': 'deep-learning',
    '블록체인': 'blockchain',
    'NFT': 'nft',
    '메타버스': 'metaverse',
    'Web3': 'web3',
    '클라우드': 'cloud',
    'DevOps': 'devops',
    '마이크로서비스': 'microservices',
    'Kubernetes': 'kubernetes',
    'Docker': 'docker',
    'React': 'react',
    'Next.js': 'nextjs',
    'Vue.js': 'vuejs',
    'Angular': 'angular',
    'TypeScript': 'typescript',
    'Node.js': 'nodejs',
    '파이썬': 'python',
    '자바': 'java',
    'Go': 'go',
    'Rust': 'rust',
    'Swift': 'swift',
    'Kotlin': 'kotlin',
    '데이터': 'data',
    '빅데이터': 'big-data',
    '시각화': 'visualization',
    'SQL': 'sql',
    'NoSQL': 'nosql',
    '사이버보안': 'cybersecurity',
    '정보보안': 'information-security',
    '해킹': 'hacking',
    '취약점': 'vulnerability',
    '스타트업': 'startup',
    '창업': 'entrepreneurship',
    '투자': 'investment',
    '펀딩': 'funding',
    'VC': 'vc',
    '마케팅': 'marketing',
    'SEO': 'seo',
    'SNS': 'sns',
    '콘텐츠': 'content',
    '그로스': 'growth',
    '재택근무': 'remote-work',
    '원격근무': 'telework',
    '효율': 'efficiency',
    '시간관리': 'time-management',
    '건강': 'health',
    '운동': 'exercise',
    '다이어트': 'diet',
    '요가': 'yoga',
    '명상': 'meditation',
    '요리': 'cooking',
    '레시피': 'recipe',
    '베이킹': 'baking',
    '카페': 'cafe',
    '여행': 'travel',
    '배낭여행': 'backpacking',
    '호텔': 'hotel',
    '항공권': 'flight',
    '영화': 'movie',
    '드라마': 'drama',
    'K-POP': 'kpop',
    '음악': 'music',
    '공연': 'performance',
    '게임': 'game',
    'e-스포츠': 'esports',
    '스트리밍': 'streaming',
    '부동산': 'real-estate',
    '재테크': 'investment',
    '주식': 'stock',
    '암호화폐': 'cryptocurrency',
    '경제': 'economy',
    '자동차': 'automobile',
    '전기차': 'electric-car',
    '자율주행': 'autonomous-driving',
    '패션': 'fashion',
    '뷰티': 'beauty',
    '화장품': 'cosmetics',
    '스타일링': 'styling',
    '육아': 'parenting',
    '교육': 'education',
    '온라인': 'online',
    '강의': 'lecture',
    '반려동물': 'pet',
    '반려견': 'dog',
    '반려묘': 'cat'
  };

  // 한글을 영문으로 변환
  let englishTitle = title;
  for (const [korean, english] of Object.entries(koreanToEnglish)) {
    englishTitle = englishTitle.replace(new RegExp(korean, 'g'), english);
  }

  return englishTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50) + `-${id}`;
}

// 1000개의 더미 아티클 생성
function generateDummyArticles(count: number = 1000): Article[] {
  const articles: Article[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 1; i <= count; i++) {
    const random = new SeededRandom(i);

    // 랜덤 토픽 선택
    const topic = random.choice(topics);
    const topic2 = random.choice(topics.filter(t => t !== topic));

    // 타이틀 생성
    const titleTemplate = random.choice(titleTemplates);
    const title = titleTemplate
      .replace('{year}', currentYear.toString())
      .replace('{topic}', topic)
      .replace('{topic2}', topic2);

    // slug 생성
    const slug = generateSlug(title, i);

    // 컨텐츠 생성
    const contentTemplate = random.choice(contentTemplates);
    const content = contentTemplate
      .replace(/{title}/g, title)
      .replace(/{topic}/g, topic);

    // excerpt 생성
    const excerptTemplate = random.choice(excerptTemplates);
    const excerpt = excerptTemplate.replace(/{topic}/g, topic);

    // 랜덤 카테고리 및 태그
    const category = random.choice(dummyCategories);
    const tagCount = random.nextInt(1, 3);
    const articleTags: Tag[] = [];
    for (let j = 0; j < tagCount; j++) {
      const tag = random.choice(dummyTags);
      if (!articleTags.find(t => t.id === tag.id)) {
        articleTags.push(tag);
      }
    }

    // 랜덤 이미지
    const imageId = random.choice(unsplashImageIds);

    // 랜덤 통계
    const trendScore = random.nextInt(50, 100);
    const viewCount = random.nextInt(100, 5000);

    // 랜덤 게시 시간 (최근 30일 내)
    const hoursAgo = random.nextInt(1, 30 * 24);
    const publishedAt = new Date(Date.now() - 1000 * 60 * 60 * hoursAgo);

    articles.push({
      id: i,
      documentId: `article-${i}`,
      title,
      slug,
      content,
      excerpt,
      seoTitle: `${title} - 완벽 가이드`,
      metaDescription: excerpt,
      keywords: [topic, topic2, category.name],
      sourceKeyword: topic,
      trendScore,
      viewCount,
      status: 'published',
      publishedAt: publishedAt.toISOString(),
      createdAt: new Date(publishedAt.getTime() - 1000 * 60 * 60).toISOString(),
      updatedAt: publishedAt.toISOString(),
      category,
      tags: articleTags,
      featuredImage: {
        url: `https://images.unsplash.com/${imageId}?w=800&h=600&fit=crop`,
        alternativeText: title
      }
    });
  }

  return articles;
}

// 더미 아티클 배열 생성
export const dummyArticles = generateDummyArticles(1000);
