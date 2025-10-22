require('dotenv').config();
const ContentGenerator = require('../services/contentGenerator');
const ImageService = require('../services/imageService');
const SEOOptimizer = require('../services/seoOptimizer');
const StrapiClient = require('../services/strapiClient');
const logger = require('../utils/logger');

class GenerateContentJob {
  constructor() {
    this.contentGenerator = new ContentGenerator();
    this.imageService = new ImageService();
    this.seoOptimizer = new SEOOptimizer();
    this.strapiClient = new StrapiClient();
    this.processedCount = 0;
    this.errorCount = 0;
  }

  /**
   * 콘텐츠 생성 Job 실행
   */
  async run() {
    logger.info('=== 콘텐츠 생성 Job 시작 ===');
    
    try {
      // 1. Strapi 연결 확인
      const isHealthy = await this.strapiClient.healthCheck();
      if (!isHealthy) {
        throw new Error('Strapi 서버 연결 실패');
      }

      // 2. 처리할 키워드 목록 가져오기
      const keywords = await this.getKeywordsToProcess();
      
      if (keywords.length === 0) {
        logger.warn('처리할 키워드가 없습니다.');
        return;
      }

      logger.info(`${keywords.length}개 키워드 처리 시작`);

      // 3. 각 키워드에 대해 콘텐츠 생성
      const results = [];
      for (const keyword of keywords) {
        try {
          const result = await this.processKeyword(keyword);
          if (result) {
            results.push(result);
            this.processedCount++;
          }
        } catch (error) {
          logger.error(`키워드 처리 실패 (${keyword}):`, error);
          this.errorCount++;
        }

        // API 비용 절약을 위한 딜레이
        await this.sleep(process.env.REQUEST_DELAY || 5000);
      }

      // 4. 결과 로깅
      this.logResults(results);

      logger.info('=== 콘텐츠 생성 Job 완료 ===');
      return results;
    } catch (error) {
      logger.error('콘텐츠 생성 Job 실패:', error);
      throw error;
    }
  }

  /**
   * 처리할 키워드 목록 가져오기
   */
  async getKeywordsToProcess() {
    try {
      // TODO: 실제로는 트렌드 수집 Job에서 저장된 키워드를 가져와야 함
      // 현재는 테스트용 키워드 사용
      const testKeywords = [
        '인공지능',
        '스마트폰',
        '경제',
        '건강',
        '여행'
      ];

      // 중복 체크
      const existingArticles = await this.strapiClient.getAllArticles();
      const existingKeywords = new Set(
        existingArticles.map(article => article.sourceKeyword?.toLowerCase())
      );

      const filteredKeywords = testKeywords.filter(keyword => 
        !existingKeywords.has(keyword.toLowerCase())
      );

      // 하루 목표 게시글 수 제한
      const maxArticles = parseInt(process.env.ARTICLES_PER_DAY) || 8;
      return filteredKeywords.slice(0, maxArticles);
    } catch (error) {
      logger.error('키워드 목록 조회 실패:', error);
      return [];
    }
  }

  /**
   * 개별 키워드 처리
   */
  async processKeyword(keyword) {
    logger.info(`키워드 처리 시작: ${keyword}`);
    
    try {
      // 1. 중복 체크
      const exists = await this.strapiClient.checkArticleExists(keyword);
      if (exists) {
        logger.info(`${keyword} 이미 존재하는 게시글`);
        return null;
      }

      // 2. 키워드 리서치
      const researchData = await this.contentGenerator.researchKeyword(keyword);
      
      // 3. 카테고리 결정
      const category = this.determineCategory(keyword, researchData);
      
      // 4. LLM으로 콘텐츠 생성
      const article = await this.contentGenerator.generateArticleWithLLM(
        keyword, 
        researchData, 
        category
      );

      // 5. 품질 검증
      const isValid = await this.contentGenerator.validateArticle(article);
      if (!isValid) {
        logger.warn(`${keyword} 콘텐츠 품질 검증 실패`);
        return null;
      }

      // 6. SEO 최적화
      const optimizedArticle = await this.seoOptimizer.optimizeArticle(
        article, 
        keyword, 
        category
      );

      // 7. 이미지 처리
      const imageData = await this.imageService.getImageForKeyword(keyword, category);

      // 8. 카테고리 및 태그 처리
      const categoryData = await this.strapiClient.findOrCreateCategory(category);
      const tagsData = await this.strapiClient.findOrCreateTags(optimizedArticle.tags);

      // 9. 게시글 데이터 구성
      const articleData = {
        title: optimizedArticle.title,
        content: optimizedArticle.content,
        excerpt: optimizedArticle.excerpt,
        seoTitle: optimizedArticle.seoTitle,
        metaDescription: optimizedArticle.metaDescription,
        keywords: optimizedArticle.keywords,
        sourceKeyword: keyword,
        trendScore: this.calculateTrendScore(keyword, researchData),
        category: categoryData.id,
        tags: tagsData.map(tag => tag.id),
        featuredImage: imageData.url,
        viewCount: 0
      };

      // 10. Strapi에 발행
      const publishedArticle = await this.strapiClient.publishArticle(articleData);

      logger.info(`${keyword} 게시글 발행 성공: ${publishedArticle.title}`);
      return publishedArticle;
    } catch (error) {
      logger.error(`키워드 처리 실패 (${keyword}):`, error);
      throw error;
    }
  }

  /**
   * 카테고리 결정
   */
  determineCategory(keyword, researchData) {
    // 리서치 데이터의 소스들을 분석하여 카테고리 결정
    const categoryScores = {};
    
    researchData.sources.forEach(source => {
      if (source.source === 'news-api' || source.source === 'naver-news') {
        categoryScores['뉴스/시사'] = (categoryScores['뉴스/시사'] || 0) + 2;
      } else if (source.source === 'wikipedia') {
        categoryScores['기타'] = (categoryScores['기타'] || 0) + 1;
      }
    });

    // 키워드 기반 카테고리 분류
    const keywordCategory = this.classifyKeyword(keyword);
    categoryScores[keywordCategory] = (categoryScores[keywordCategory] || 0) + 3;

    // 가장 높은 점수의 카테고리 반환
    const bestCategory = Object.entries(categoryScores)
      .sort(([,a], [,b]) => b - a)[0];

    return bestCategory ? bestCategory[0] : '기타';
  }

  /**
   * 키워드 카테고리 분류
   */
  classifyKeyword(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerKeyword.includes('ai') || lowerKeyword.includes('인공지능') || 
        lowerKeyword.includes('스마트폰') || lowerKeyword.includes('앱')) {
      return '기술/IT';
    }
    
    if (lowerKeyword.includes('경제') || lowerKeyword.includes('주식') || 
        lowerKeyword.includes('투자') || lowerKeyword.includes('부동산')) {
      return '경제/재테크';
    }
    
    if (lowerKeyword.includes('건강') || lowerKeyword.includes('운동') || 
        lowerKeyword.includes('다이어트') || lowerKeyword.includes('의료')) {
      return '생활/건강';
    }
    
    if (lowerKeyword.includes('여행') || lowerKeyword.includes('관광') || 
        lowerKeyword.includes('문화') || lowerKeyword.includes('축제')) {
      return '여행/문화';
    }
    
    return '기타';
  }

  /**
   * 트렌드 점수 계산
   */
  calculateTrendScore(keyword, researchData) {
    let score = 5; // 기본 점수
    
    // 소스 수에 따른 점수 추가
    score += Math.min(researchData.sources.length * 0.5, 3);
    
    // 뉴스 소스가 있으면 추가 점수
    const hasNews = researchData.sources.some(source => 
      source.source === 'news-api' || source.source === 'naver-news'
    );
    if (hasNews) score += 2;
    
    // 위키피디아 소스가 있으면 추가 점수
    const hasWiki = researchData.sources.some(source => source.source === 'wikipedia');
    if (hasWiki) score += 1;
    
    return Math.round(score * 10) / 10;
  }

  /**
   * 결과 로깅
   */
  logResults(results) {
    const stats = {
      totalProcessed: this.processedCount,
      totalErrors: this.errorCount,
      successRate: this.processedCount > 0 ? 
        ((this.processedCount / (this.processedCount + this.errorCount)) * 100).toFixed(1) + '%' : '0%',
      articles: results.map(article => ({
        title: article.title,
        keyword: article.sourceKeyword,
        category: article.category?.name,
        trendScore: article.trendScore
      }))
    };

    logger.info('콘텐츠 생성 결과:', stats);
  }

  /**
   * 대기 함수
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 특정 키워드로 콘텐츠 생성 (테스트용)
   */
  async generateForKeyword(keyword) {
    logger.info(`테스트용 콘텐츠 생성: ${keyword}`);
    return await this.processKeyword(keyword);
  }
}

// 직접 실행 시
if (require.main === module) {
  const job = new GenerateContentJob();
  job.run()
    .then((results) => {
      logger.info(`콘텐츠 생성 Job 완료: ${results?.length || 0}개 게시글 생성`);
      process.exit(0);
    })
    .catch((error) => {
      logger.error('콘텐츠 생성 Job 실패:', error);
      process.exit(1);
    });
}

module.exports = GenerateContentJob;
