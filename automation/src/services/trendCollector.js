const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const googleTrends = require('google-trends-api');
const logger = require('../utils/logger');

class TrendCollector {
  constructor() {
    this.trends = [];
    this.categories = [
      '뉴스/시사',
      '엔터테인먼트/연예',
      '기술/IT',
      '생활/건강',
      '경제/재테크',
      '요리/맛집',
      '여행/문화',
      '스포츠',
      '교육',
      '기타'
    ];
  }

  /**
   * 모든 트렌드 소스에서 데이터 수집
   */
  async collectAllTrends() {
    logger.info('트렌드 데이터 수집 시작');

    try {
      const results = await Promise.allSettled([
        this.collectGoogleTrends(),
        this.collectNaverTrends(),
        this.collectNewsHeadlines(),
        this.collectSocialMediaTrends()
      ]);

      // 결과 병합 및 중복 제거
      const allTrends = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allTrends.push(...result.value);
          logger.info(`트렌드 소스 ${index + 1}에서 ${result.value.length}개 키워드 수집`);
        } else {
          logger.error(`트렌드 소스 ${index + 1} 수집 실패:`, result.reason);
        }
      });

      // 중복 제거 및 정규화
      const uniqueTrends = this.deduplicateTrends(allTrends);

      // 트렌드 점수 계산
      const scoredTrends = this.calculateTrendScores(uniqueTrends);

      // 우선순위 정렬
      const sortedTrends = scoredTrends.sort((a, b) => b.trendScore - a.trendScore);

      logger.info(`총 ${sortedTrends.length}개 고유 키워드 수집 완료`);

      return sortedTrends;
    } catch (error) {
      logger.error('트렌드 수집 중 오류 발생:', error);
      throw error;
    }
  }

  /**
   * Google Trends에서 실시간 트렌드 수집
   */
  async collectGoogleTrends() {
    try {
      const trends = await googleTrends.realTimeTrends({
        geo: 'KR',
        category: 'all',
        count: 20
      });

      const parsedTrends = JSON.parse(trends);
      const keywords = [];

      if (parsedTrends.default && parsedTrends.default.trendingSearchesDays) {
        parsedTrends.default.trendingSearchesDays.forEach(day => {
          day.trendingSearches.forEach(search => {
            keywords.push({
              keyword: search.title.query,
              source: 'google-trends',
              category: this.categorizeKeyword(search.title.query),
              searchVolume: search.formattedTraffic || '0',
              trendScore: this.calculateGoogleTrendScore(search),
              timestamp: new Date().toISOString()
            });
          });
        });
      }

      return keywords;
    } catch (error) {
      logger.error('Google Trends 수집 실패:', error);
      return [];
    }
  }

  /**
   * 네이버 실시간 검색어 수집 (크롤링)
   */
  async collectNaverTrends() {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      await page.goto('https://datalab.naver.com/keyword/realtime', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const trends = await page.evaluate(() => {
        const keywords = [];
        const elements = document.querySelectorAll('.item_title');

        elements.forEach((element, index) => {
          const keyword = element.textContent.trim();
          if (keyword) {
            keywords.push({
              keyword,
              rank: index + 1,
              source: 'naver-realtime'
            });
          }
        });

        return keywords;
      });

      await browser.close();

      return trends.map(trend => ({
        keyword: trend.keyword,
        source: 'naver-realtime',
        category: this.categorizeKeyword(trend.keyword),
        rank: trend.rank,
        trendScore: this.calculateNaverTrendScore(trend.rank),
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      logger.error('네이버 트렌드 수집 실패:', error);
      return [];
    }
  }

  /**
   * 뉴스 헤드라인에서 키워드 추출
   */
  async collectNewsHeadlines() {
    try {
      const newsSources = [
        'https://news.naver.com/main/ranking/popularDay.naver',
        'https://www.daum.net',
        'https://news.yahoo.co.jp'
      ];

      const keywords = [];

      for (const source of newsSources) {
        try {
          const response = await axios.get(source, {
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          const $ = cheerio.load(response.data);
          const headlines = [];

          // 네이버 뉴스
          if (source.includes('naver.com')) {
            $('.list_title a').each((i, element) => {
              const headline = $(element).text().trim();
              if (headline) headlines.push(headline);
            });
          }
          // 다음 뉴스
          else if (source.includes('daum.net')) {
            $('.link_txt').each((i, element) => {
              const headline = $(element).text().trim();
              if (headline) headlines.push(headline);
            });
          }

          // 헤드라인에서 키워드 추출
          headlines.forEach(headline => {
            const extractedKeywords = this.extractKeywordsFromHeadline(headline);
            extractedKeywords.forEach(keyword => {
              keywords.push({
                keyword,
                source: 'news-headlines',
                category: this.categorizeKeyword(keyword),
                headline,
                trendScore: this.calculateNewsTrendScore(keyword, headline),
                timestamp: new Date().toISOString()
              });
            });
          });
        } catch (sourceError) {
          logger.warn(`${source} 수집 실패:`, sourceError.message);
        }
      }

      return keywords;
    } catch (error) {
      logger.error('뉴스 헤드라인 수집 실패:', error);
      return [];
    }
  }

  /**
   * 소셜 미디어 트렌드 수집 (Twitter/X API 대신 웹 크롤링)
   */
  async collectSocialMediaTrends() {
    try {
      // Twitter 트렌딩 해시태그 수집 (웹 크롤링)
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      // Twitter 트렌딩 페이지 접근 시도
      try {
        await page.goto('https://twitter.com/explore/tabs/trending', {
          waitUntil: 'networkidle2',
          timeout: 15000
        });

        const trends = await page.evaluate(() => {
          const keywords = [];
          const elements = document.querySelectorAll('[data-testid="trend"]');

          elements.forEach(element => {
            const text = element.textContent.trim();
            if (text && text.startsWith('#')) {
              keywords.push({
                keyword: text.replace('#', ''),
                source: 'twitter-trending'
              });
            }
          });

          return keywords;
        });

        await browser.close();

        return trends.map(trend => ({
          keyword: trend.keyword,
          source: 'twitter-trending',
          category: this.categorizeKeyword(trend.keyword),
          trendScore: this.calculateSocialTrendScore(),
          timestamp: new Date().toISOString()
        }));
      } catch (twitterError) {
        logger.warn('Twitter 트렌드 수집 실패:', twitterError.message);
        await browser.close();
        return [];
      }
    } catch (error) {
      logger.error('소셜 미디어 트렌드 수집 실패:', error);
      return [];
    }
  }

  /**
   * 키워드 카테고리 자동 분류
   */
  categorizeKeyword(keyword) {
    const lowerKeyword = keyword.toLowerCase();

    // 뉴스/시사
    if (lowerKeyword.includes('정치') || lowerKeyword.includes('선거') ||
        lowerKeyword.includes('정부') || lowerKeyword.includes('국회')) {
      return '뉴스/시사';
    }

    // 엔터테인먼트
    if (lowerKeyword.includes('연예') || lowerKeyword.includes('드라마') ||
        lowerKeyword.includes('영화') || lowerKeyword.includes('음악') ||
        lowerKeyword.includes('아이돌') || lowerKeyword.includes('배우')) {
      return '엔터테인먼트/연예';
    }

    // 기술/IT
    if (lowerKeyword.includes('ai') || lowerKeyword.includes('인공지능') ||
        lowerKeyword.includes('스마트폰') || lowerKeyword.includes('앱') ||
        lowerKeyword.includes('소프트웨어') || lowerKeyword.includes('기술')) {
      return '기술/IT';
    }

    // 생활/건강
    if (lowerKeyword.includes('건강') || lowerKeyword.includes('운동') ||
        lowerKeyword.includes('다이어트') || lowerKeyword.includes('의료') ||
        lowerKeyword.includes('병원') || lowerKeyword.includes('약')) {
      return '생활/건강';
    }

    // 경제/재테크
    if (lowerKeyword.includes('주식') || lowerKeyword.includes('경제') ||
        lowerKeyword.includes('투자') || lowerKeyword.includes('부동산') ||
        lowerKeyword.includes('금리') || lowerKeyword.includes('은행')) {
      return '경제/재테크';
    }

    // 요리/맛집
    if (lowerKeyword.includes('맛집') || lowerKeyword.includes('요리') ||
        lowerKeyword.includes('레시피') || lowerKeyword.includes('음식') ||
        lowerKeyword.includes('카페') || lowerKeyword.includes('식당')) {
      return '요리/맛집';
    }

    // 여행/문화
    if (lowerKeyword.includes('여행') || lowerKeyword.includes('관광') ||
        lowerKeyword.includes('문화') || lowerKeyword.includes('축제') ||
        lowerKeyword.includes('박물관') || lowerKeyword.includes('전시')) {
      return '여행/문화';
    }

    // 스포츠
    if (lowerKeyword.includes('축구') || lowerKeyword.includes('야구') ||
        lowerKeyword.includes('농구') || lowerKeyword.includes('올림픽') ||
        lowerKeyword.includes('월드컵') || lowerKeyword.includes('선수')) {
      return '스포츠';
    }

    // 교육
    if (lowerKeyword.includes('교육') || lowerKeyword.includes('학교') ||
        lowerKeyword.includes('학원') || lowerKeyword.includes('시험') ||
        lowerKeyword.includes('입시') || lowerKeyword.includes('대학')) {
      return '교육';
    }

    return '기타';
  }

  /**
   * 트렌드 점수 계산
   */
  calculateTrendScores(trends) {
    return trends.map(trend => {
      let baseScore = 0;

      // 소스별 기본 점수
      switch (trend.source) {
        case 'google-trends':
          baseScore = 10;
          break;
        case 'naver-realtime':
          baseScore = 8;
          break;
        case 'news-headlines':
          baseScore = 6;
          break;
        case 'twitter-trending':
          baseScore = 4;
          break;
        default:
          baseScore = 2;
      }

      // 추가 점수 계산
      if (trend.rank) {
        baseScore += Math.max(0, 10 - trend.rank);
      }

      if (trend.searchVolume) {
        const volume = parseInt(trend.searchVolume.replace(/[^\d]/g, '')) || 0;
        baseScore += Math.min(volume / 1000, 5);
      }

      // 급상승 키워드 보너스
      if (trend.keyword.includes('급상승') || trend.keyword.includes('화제')) {
        baseScore += 3;
      }

      return {
        ...trend,
        trendScore: Math.round(baseScore * 10) / 10
      };
    });
  }

  /**
   * 중복 키워드 제거
   */
  deduplicateTrends(trends) {
    const seen = new Set();
    const unique = [];

    trends.forEach(trend => {
      const normalizedKeyword = trend.keyword.toLowerCase().trim();
      if (!seen.has(normalizedKeyword)) {
        seen.add(normalizedKeyword);
        unique.push(trend);
      }
    });

    return unique;
  }

  /**
   * 헤드라인에서 키워드 추출
   */
  extractKeywordsFromHeadline(headline) {
    // 간단한 키워드 추출 로직
    const keywords = [];
    const words = headline.split(/[\s,，。！？]/);

    words.forEach(word => {
      const trimmed = word.trim();
      if (trimmed.length >= 2 && trimmed.length <= 10) {
        // 한글, 영문, 숫자만 포함된 키워드만 추출
        if (/^[가-힣a-zA-Z0-9\s]+$/.test(trimmed)) {
          keywords.push(trimmed);
        }
      }
    });

    return keywords.slice(0, 3); // 최대 3개 키워드만 추출
  }

  // 각 소스별 점수 계산 메서드들
  calculateGoogleTrendScore(search) {
    return search.formattedTraffic ? 8 : 5;
  }

  calculateNaverTrendScore(rank) {
    return Math.max(0, 10 - rank);
  }

  calculateNewsTrendScore(keyword, headline) {
    return headline.includes(keyword) ? 6 : 3;
  }

  calculateSocialTrendScore() {
    return 4;
  }
}

module.exports = TrendCollector;
