const axios = require('axios');
const logger = require('../utils/logger');

class ContentGenerator {
  constructor() {
    this.openai = null;
    this.initializeOpenAI();
  }

  /**
   * OpenAI 클라이언트 초기화
   */
  initializeOpenAI() {
    try {
      const { OpenAI } = require('openai');
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      logger.info('OpenAI 클라이언트 초기화 완료');
    } catch (error) {
      logger.error('OpenAI 클라이언트 초기화 실패:', error);
    }
  }

  /**
   * 키워드 리서치 수행
   */
  async researchKeyword(keyword) {
    logger.info(`키워드 리서치 시작: ${keyword}`);

    try {
      const researchData = {
        keyword,
        timestamp: new Date().toISOString(),
        sources: []
      };

      // Google Search API로 관련 정보 검색
      if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID) {
        const searchResults = await this.searchGoogle(keyword);
        researchData.sources.push(...searchResults);
      }

      // 뉴스 API로 최신 뉴스 검색
      const newsResults = await this.searchNews(keyword);
      researchData.sources.push(...newsResults);

      // 위키피디아 정보 검색
      const wikiInfo = await this.searchWikipedia(keyword);
      if (wikiInfo) {
        researchData.sources.push(wikiInfo);
      }

      logger.info(`${keyword} 리서치 완료: ${researchData.sources.length}개 소스 수집`);
      return researchData;
    } catch (error) {
      logger.error(`키워드 리서치 실패 (${keyword}):`, error);
      return {
        keyword,
        timestamp: new Date().toISOString(),
        sources: []
      };
    }
  }

  /**
   * Google Search API 검색
   */
  async searchGoogle(keyword) {
    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: process.env.GOOGLE_SEARCH_API_KEY,
          cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
          q: keyword,
          num: 5,
          lr: 'lang_ko'
        }
      });

      return response.data.items?.map(item => ({
        title: item.title,
        snippet: item.snippet,
        url: item.link,
        source: 'google-search'
      })) || [];
    } catch (error) {
      logger.warn(`Google Search 실패 (${keyword}):`, error.message);
      return [];
    }
  }

  /**
   * 뉴스 검색 (NewsAPI 또는 웹 크롤링)
   */
  async searchNews(keyword) {
    try {
      // NewsAPI 사용 (API 키가 있는 경우)
      if (process.env.NEWS_API_KEY) {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            apiKey: process.env.NEWS_API_KEY,
            q: keyword,
            language: 'ko',
            sortBy: 'publishedAt',
            pageSize: 5
          }
        });

        return response.data.articles?.map(article => ({
          title: article.title,
          snippet: article.description,
          url: article.url,
          publishedAt: article.publishedAt,
          source: 'news-api'
        })) || [];
      }

      // NewsAPI가 없는 경우 웹 크롤링으로 대체
      return await this.crawlNews(keyword);
    } catch (error) {
      logger.warn(`뉴스 검색 실패 (${keyword}):`, error.message);
      return [];
    }
  }

  /**
   * 뉴스 웹 크롤링
   */
  async crawlNews(keyword) {
    try {
      const cheerio = require('cheerio');
      const newsSources = [
        `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(keyword)}`,
        `https://search.daum.net/search?w=news&q=${encodeURIComponent(keyword)}`
      ];

      const results = [];

      for (const source of newsSources) {
        try {
          const response = await axios.get(source, {
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          const $ = cheerio.load(response.data);

          // 네이버 뉴스
          if (source.includes('naver.com')) {
            $('.news_area').each((i, element) => {
              const title = $(element).find('.news_tit').text().trim();
              const snippet = $(element).find('.news_dsc').text().trim();
              const url = $(element).find('.news_tit').attr('href');

              if (title && snippet) {
                results.push({
                  title,
                  snippet,
                  url,
                  source: 'naver-news'
                });
              }
            });
          }
        } catch (sourceError) {
          logger.warn(`뉴스 소스 크롤링 실패 (${source}):`, sourceError.message);
        }
      }

      return results.slice(0, 5);
    } catch (error) {
      logger.warn(`뉴스 크롤링 실패 (${keyword}):`, error.message);
      return [];
    }
  }

  /**
   * 위키피디아 정보 검색
   */
  async searchWikipedia(keyword) {
    try {
      const response = await axios.get('https://ko.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(keyword), {
        timeout: 5000
      });

      if (response.data && response.data.extract) {
        return {
          title: response.data.title,
          snippet: response.data.extract,
          url: response.data.content_urls?.desktop?.page,
          source: 'wikipedia'
        };
      }
    } catch (error) {
      logger.warn(`위키피디아 검색 실패 (${keyword}):`, error.message);
    }
    return null;
  }

  /**
   * LLM으로 콘텐츠 생성
   */
  async generateArticleWithLLM(keyword, researchData, category = '기타') {
    logger.info(`LLM 콘텐츠 생성 시작: ${keyword}`);

    try {
      const prompt = this.buildPrompt(keyword, researchData, category);

      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 SEO 최적화된 블로그 글을 작성하는 전문 작가입니다. 한국어로 자연스럽고 읽기 쉬운 글을 작성하며, 독자에게 유용한 정보를 제공합니다.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.3
      });

      const content = response.choices[0].message.content;

      // JSON 파싱 시도
      try {
        const parsedContent = JSON.parse(content);
        logger.info(`${keyword} 콘텐츠 생성 성공`);
        return parsedContent;
      } catch (parseError) {
        // JSON 파싱 실패 시 텍스트를 구조화된 객체로 변환
        logger.warn(`${keyword} JSON 파싱 실패, 텍스트 변환 시도`);
        return this.parseTextToArticle(content, keyword, category);
      }
    } catch (error) {
      logger.error(`LLM 콘텐츠 생성 실패 (${keyword}):`, error);
      throw error;
    }
  }

  /**
   * 프롬프트 구성
   */
  buildPrompt(keyword, researchData, category) {
    const sources = researchData.sources.map(source =>
      `- ${source.title}: ${source.snippet}`
    ).join('\n');

    return `
주제: ${keyword}
카테고리: ${category}
참고 정보:
${sources}

요구사항:
1. SEO 최적화된 제목 생성 (60자 이내, 키워드 포함)
2. 본문 1,500자 이상 작성
3. H2, H3 소제목 구조화
4. 자연스러운 키워드 배치 (밀도 2-3%)
5. 마지막에 결론 섹션 포함
6. 독자에게 유용한 정보 제공

출력 형식: JSON
{
  "title": "제목",
  "content": "본문 내용 (Markdown 형식)",
  "excerpt": "요약 (150자 이내)",
  "seoTitle": "SEO 제목",
  "metaDescription": "메타 설명 (160자 이내)",
  "tags": ["태그1", "태그2", "태그3"]
}
`;
  }

  /**
   * 텍스트를 구조화된 게시글 객체로 변환
   */
  parseTextToArticle(content, keyword, category) {
    const lines = content.split('\n').filter(line => line.trim());

    let title = keyword;
    let excerpt = '';
    let articleContent = content;
    let tags = [keyword, category];

    // 제목 추출 시도
    const titleMatch = content.match(/^#\s*(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1];
    }

    // 요약 추출 시도 (첫 번째 문단)
    const firstParagraph = content.split('\n\n')[0];
    if (firstParagraph && firstParagraph.length > 50) {
      excerpt = firstParagraph.substring(0, 150) + '...';
    }

    return {
      title,
      content: articleContent,
      excerpt,
      seoTitle: title,
      metaDescription: excerpt,
      tags
    };
  }

  /**
   * 콘텐츠 품질 검증
   */
  async validateArticle(article) {
    const validations = {
      minLength: article.content.length >= 1000,
      titleLength: article.title.length >= 10 && article.title.length <= 60,
      hasExcerpt: article.excerpt && article.excerpt.length >= 50,
      hasTags: article.tags && article.tags.length > 0,
      noProfanity: !this.containsProfanity(article.content),
      keywordDensity: this.checkKeywordDensity(article.content, article.title)
    };

    const isValid = Object.values(validations).every(Boolean);

    if (!isValid) {
      logger.warn('콘텐츠 검증 실패:', validations);
    }

    return isValid;
  }

  /**
   * 금칙어 검사
   */
  containsProfanity(content) {
    const profanityWords = [
      '욕설', '비방', '혐오', '폭력', '성인', '도박', '마약'
    ];

    return profanityWords.some(word => content.includes(word));
  }

  /**
   * 키워드 밀도 검사
   */
  checkKeywordDensity(content, title) {
    const keyword = title.split(' ')[0]; // 첫 번째 단어를 키워드로 사용
    const contentWords = content.split(/\s+/).length;
    const keywordCount = (content.match(new RegExp(keyword, 'gi')) || []).length;

    const density = (keywordCount / contentWords) * 100;
    return density >= 1 && density <= 5; // 1-5% 범위
  }

  /**
   * 재시도 로직이 포함된 LLM 호출
   */
  async callLLMWithRetry(prompt, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.openai.chat.completions.create(prompt);
      } catch (error) {
        if (i === maxRetries - 1) throw error;

        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        logger.warn(`LLM 호출 실패, ${delay}ms 후 재시도... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

module.exports = ContentGenerator;
