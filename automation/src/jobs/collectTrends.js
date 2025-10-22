require('dotenv').config();
const TrendCollector = require('../services/trendCollector');
const StrapiClient = require('../services/strapiClient');
const logger = require('../utils/logger');

class CollectTrendsJob {
  constructor() {
    this.trendCollector = new TrendCollector();
    this.strapiClient = new StrapiClient();
    this.trends = [];
  }

  /**
   * 트렌드 수집 Job 실행
   */
  async run() {
    logger.info('=== 트렌드 수집 Job 시작 ===');
    
    try {
      // 1. Strapi 연결 확인
      const isHealthy = await this.strapiClient.healthCheck();
      if (!isHealthy) {
        throw new Error('Strapi 서버 연결 실패');
      }

      // 2. 트렌드 데이터 수집
      logger.info('트렌드 데이터 수집 시작...');
      this.trends = await this.trendCollector.collectAllTrends();
      
      if (this.trends.length === 0) {
        logger.warn('수집된 트렌드가 없습니다.');
        return;
      }

      // 3. 중복 제거 (기존 게시글과 비교)
      logger.info('중복 키워드 필터링 시작...');
      const filteredTrends = await this.filterExistingKeywords(this.trends);
      
      logger.info(`중복 제거 후 ${filteredTrends.length}개 키워드 남음`);

      // 4. 최소 트렌드 점수 필터링
      const minScore = parseFloat(process.env.MIN_TREND_SCORE) || 0.5;
      const qualifiedTrends = filteredTrends.filter(trend => trend.trendScore >= minScore);
      
      logger.info(`최소 점수(${minScore}) 이상 키워드: ${qualifiedTrends.length}개`);

      // 5. 결과 저장 (임시로 로그에 출력, 추후 DB 저장 구현)
      await this.saveTrends(qualifiedTrends);

      // 6. 통계 로깅
      this.logStatistics(qualifiedTrends);

      logger.info('=== 트렌드 수집 Job 완료 ===');
      
      return qualifiedTrends;
    } catch (error) {
      logger.error('트렌드 수집 Job 실패:', error);
      throw error;
    }
  }

  /**
   * 기존 게시글과 중복되는 키워드 필터링
   */
  async filterExistingKeywords(trends) {
    try {
      // 기존 게시글의 sourceKeyword 목록 조회
      const existingArticles = await this.strapiClient.getAllArticles();
      const existingKeywords = new Set(
        existingArticles.map(article => article.sourceKeyword?.toLowerCase())
      );

      // 중복되지 않는 키워드만 필터링
      const filteredTrends = trends.filter(trend => {
        const normalizedKeyword = trend.keyword.toLowerCase();
        return !existingKeywords.has(normalizedKeyword);
      });

      logger.info(`기존 게시글과 중복되는 키워드 ${trends.length - filteredTrends.length}개 제거`);
      
      return filteredTrends;
    } catch (error) {
      logger.error('중복 키워드 필터링 실패:', error);
      return trends; // 오류 시 원본 반환
    }
  }

  /**
   * 트렌드 데이터 저장 (임시 구현)
   */
  async saveTrends(trends) {
    try {
      // 현재는 로그에만 저장, 추후 Redis나 DB에 저장 구현
      logger.info('수집된 트렌드 키워드:', {
        count: trends.length,
        keywords: trends.slice(0, 10).map(t => ({
          keyword: t.keyword,
          score: t.trendScore,
          source: t.source,
          category: t.category
        }))
      });

      // TODO: Redis나 임시 DB에 저장하여 콘텐츠 생성 Job에서 사용
      // await this.saveToCache(trends);
      
    } catch (error) {
      logger.error('트렌드 저장 실패:', error);
    }
  }

  /**
   * 수집 통계 로깅
   */
  logStatistics(trends) {
    const stats = {
      totalKeywords: trends.length,
      bySource: {},
      byCategory: {},
      topKeywords: trends.slice(0, 5).map(t => ({
        keyword: t.keyword,
        score: t.trendScore,
        source: t.source
      }))
    };

    // 소스별 통계
    trends.forEach(trend => {
      stats.bySource[trend.source] = (stats.bySource[trend.source] || 0) + 1;
    });

    // 카테고리별 통계
    trends.forEach(trend => {
      stats.byCategory[trend.category] = (stats.byCategory[trend.category] || 0) + 1;
    });

    logger.info('트렌드 수집 통계:', stats);
  }

  /**
   * 상위 N개 키워드 조회
   */
  async getTopKeywords(limit = 5) {
    try {
      // 임시로 수집된 트렌드에서 반환, 추후 캐시에서 조회
      const sortedTrends = this.trends
        .sort((a, b) => b.trendScore - a.trendScore)
        .slice(0, limit);

      return sortedTrends.map(trend => trend.keyword);
    } catch (error) {
      logger.error('상위 키워드 조회 실패:', error);
      return [];
    }
  }
}

// 직접 실행 시
if (require.main === module) {
  const job = new CollectTrendsJob();
  job.run()
    .then(() => {
      logger.info('트렌드 수집 Job 완료');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('트렌드 수집 Job 실패:', error);
      process.exit(1);
    });
}

module.exports = CollectTrendsJob;
