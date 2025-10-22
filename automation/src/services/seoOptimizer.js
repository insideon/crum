const logger = require('../utils/logger');

class SEOOptimizer {
  constructor() {
    this.stopWords = [
      '그리고', '그런데', '하지만', '그러나', '또한', '또는', '그리고', '그래서',
      '따라서', '그러므로', '즉', '예를 들어', '특히', '주로', '대부분', '일반적으로'
    ];
  }

  /**
   * 게시글 SEO 최적화 처리
   */
  async optimizeArticle(article, keyword, category) {
    logger.info(`SEO 최적화 시작: ${article.title}`);

    try {
      const optimized = {
        ...article,
        slug: this.generateSlug(article.title),
        seoTitle: this.generateSEOTitle(article.title, keyword),
        metaDescription: this.generateMetaDescription(article.excerpt, keyword),
        keywords: this.extractKeywords(article.content, keyword),
        content: this.optimizeContent(article.content, keyword),
        internalLinks: this.generateInternalLinks(article.content, category)
      };

      logger.info(`${article.title} SEO 최적화 완료`);
      return optimized;
    } catch (error) {
      logger.error(`SEO 최적화 실패 (${article.title}):`, error);
      return article;
    }
  }

  /**
   * URL 친화적 슬러그 생성
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
  }

  /**
   * SEO 최적화된 제목 생성
   */
  generateSEOTitle(title, keyword) {
    // 제목이 이미 키워드를 포함하고 있는지 확인
    if (title.toLowerCase().includes(keyword.toLowerCase())) {
      return title.length <= 60 ? title : title.substring(0, 57) + '...';
    }

    // 키워드를 포함한 SEO 제목 생성
    const seoTitle = `${keyword} ${title}`;
    return seoTitle.length <= 60 ? seoTitle : seoTitle.substring(0, 57) + '...';
  }

  /**
   * 메타 설명 생성
   */
  generateMetaDescription(excerpt, keyword) {
    if (!excerpt) {
      return `${keyword}에 대한 자세한 정보와 최신 뉴스를 확인하세요. 전문가가 분석한 내용을 통해 더 깊이 있게 알아보세요.`;
    }

    // 키워드가 포함된 설명 우선 사용
    if (excerpt.toLowerCase().includes(keyword.toLowerCase())) {
      return excerpt.length <= 160 ? excerpt : excerpt.substring(0, 157) + '...';
    }

    // 키워드를 포함한 설명 생성
    const metaDescription = `${keyword} 관련: ${excerpt}`;
    return metaDescription.length <= 160 ? metaDescription : metaDescription.substring(0, 157) + '...';
  }

  /**
   * 콘텐츠에서 키워드 추출
   */
  extractKeywords(content, mainKeyword) {
    const keywords = [mainKeyword];

    // 콘텐츠에서 중요한 단어 추출
    const words = content
      .replace(/[^\w\s가-힣]/g, ' ')
      .split(/\s+/)
      .filter(word =>
        word.length >= 2 &&
        word.length <= 10 &&
        !this.stopWords.includes(word) &&
        !keywords.includes(word)
      );

    // 빈도수 계산
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // 상위 키워드 선택
    const sortedWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([word]) => word);

    keywords.push(...sortedWords);
    return keywords.slice(0, 5); // 최대 5개 키워드
  }

  /**
   * 콘텐츠 최적화
   */
  optimizeContent(content, keyword) {
    let optimized = content;

    // 1. 키워드 밀도 조정 (2-3% 목표)
    optimized = this.adjustKeywordDensity(optimized, keyword);

    // 2. 헤딩 구조 최적화
    optimized = this.optimizeHeadings(optimized, keyword);

    // 3. 문단 길이 조정
    optimized = this.optimizeParagraphs(optimized);

    // 4. 리스트 최적화
    optimized = this.optimizeLists(optimized);

    return optimized;
  }

  /**
   * 키워드 밀도 조정
   */
  adjustKeywordDensity(content, keyword) {
    const words = content.split(/\s+/);
    const totalWords = words.length;
    const keywordCount = (content.match(new RegExp(keyword, 'gi')) || []).length;
    const currentDensity = (keywordCount / totalWords) * 100;

    // 목표 밀도: 2-3%
    if (currentDensity < 2) {
      // 키워드 추가 (자연스럽게)
      const sentences = content.split(/[.!?]/);
      const optimizedSentences = sentences.map(sentence => {
        if (sentence.trim() && !sentence.toLowerCase().includes(keyword.toLowerCase())) {
          // 문장에 키워드를 자연스럽게 추가
          return sentence + ` 이는 ${keyword}와 관련된 중요한 내용입니다.`;
        }
        return sentence;
      });
      return optimizedSentences.join('.');
    } else if (currentDensity > 3) {
      // 키워드 밀도가 너무 높으면 동의어로 대체
      const synonyms = this.getSynonyms(keyword);
      return content.replace(new RegExp(keyword, 'gi'), (match, offset) => {
        if (offset % 3 === 0 && synonyms.length > 0) {
          return synonyms[Math.floor(Math.random() * synonyms.length)];
        }
        return match;
      });
    }

    return content;
  }

  /**
   * 헤딩 구조 최적화
   */
  optimizeHeadings(content, keyword) {
    // H1은 제목에만 사용되므로 H2, H3 최적화
    let optimized = content;

    // H2 태그에 키워드 포함 확인
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    optimized = optimized.replace(h2Regex, (match, headingText) => {
      if (!headingText.toLowerCase().includes(keyword.toLowerCase())) {
        return match.replace(headingText, `${keyword} 관련 ${headingText}`);
      }
      return match;
    });

    return optimized;
  }

  /**
   * 문단 길이 최적화
   */
  optimizeParagraphs(content) {
    const paragraphs = content.split(/\n\s*\n/);

    return paragraphs.map(paragraph => {
      const sentences = paragraph.split(/[.!?]/);

      // 너무 긴 문단은 분할
      if (sentences.length > 5) {
        const midPoint = Math.floor(sentences.length / 2);
        const firstHalf = sentences.slice(0, midPoint).join('.') + '.';
        const secondHalf = sentences.slice(midPoint).join('.');
        return `${firstHalf}\n\n${secondHalf}`;
      }

      return paragraph;
    }).join('\n\n');
  }

  /**
   * 리스트 최적화
   */
  optimizeLists(content) {
    // 불릿 포인트를 더 읽기 쉽게 최적화
    return content.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, listContent) => {
      const items = listContent.match(/<li[^>]*>(.*?)<\/li>/gi);
      if (items && items.length > 7) {
        // 너무 긴 리스트는 두 개로 분할
        const midPoint = Math.floor(items.length / 2);
        const firstHalf = items.slice(0, midPoint).join('');
        const secondHalf = items.slice(midPoint).join('');
        return `<ul>${firstHalf}</ul>\n\n<ul>${secondHalf}</ul>`;
      }
      return match;
    });
  }

  /**
   * 내부 링크 생성
   */
  generateInternalLinks(content, category) {
    // 관련 게시글 링크를 위한 키워드 추출
    const keywords = this.extractKeywords(content, '');
    return keywords.slice(0, 3); // 상위 3개 키워드 반환
  }

  /**
   * 동의어 사전
   */
  getSynonyms(keyword) {
    const synonymDict = {
      '인공지능': ['AI', '머신러닝', '딥러닝'],
      '스마트폰': ['휴대폰', '모바일', '핸드폰'],
      '경제': ['경영', '재정', '금융'],
      '건강': ['웰빙', '의료', '보건'],
      '여행': ['관광', '휴가', '출장']
    };

    return synonymDict[keyword] || [];
  }

  /**
   * Schema.org 구조화 데이터 생성
   */
  generateSchemaData(article, keyword, category) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: article.featuredImage?.url,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Organization',
        name: 'Crum Blog'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Crum Blog',
        logo: {
          '@type': 'ImageObject',
          url: 'https://crum.blog/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://crum.blog/articles/${article.slug}`
      },
      articleSection: category,
      keywords: article.keywords?.join(', '),
      wordCount: article.content.length,
      inLanguage: 'ko-KR'
    };
  }

  /**
   * Open Graph 메타 태그 생성
   */
  generateOpenGraphTags(article, keyword) {
    return {
      'og:title': article.seoTitle || article.title,
      'og:description': article.metaDescription || article.excerpt,
      'og:image': article.featuredImage?.url,
      'og:url': `https://crum.blog/articles/${article.slug}`,
      'og:type': 'article',
      'og:site_name': 'Crum Blog',
      'og:locale': 'ko_KR'
    };
  }

  /**
   * Twitter Card 메타 태그 생성
   */
  generateTwitterCardTags(article, keyword) {
    return {
      'twitter:card': 'summary_large_image',
      'twitter:title': article.seoTitle || article.title,
      'twitter:description': article.metaDescription || article.excerpt,
      'twitter:image': article.featuredImage?.url,
      'twitter:site': '@crumblog'
    };
  }
}

module.exports = SEOOptimizer;
