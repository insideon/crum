require('dotenv').config();
const StrapiClient = require('../services/strapiClient');
const logger = require('../utils/logger');

class AnalyzePerformanceJob {
  constructor() {
    this.strapiClient = new StrapiClient();
  }

  /**
   * 성과 분석 Job 실행
   */
  async run() {
    logger.info('=== 성과 분석 Job 시작 ===');
    
    try {
      // 1. Strapi 연결 확인
      const isHealthy = await this.strapiClient.healthCheck();
      if (!isHealthy) {
        throw new Error('Strapi 서버 연결 실패');
      }

      // 2. 일일 통계 수집
      const dailyStats = await this.collectDailyStats();
      
      // 3. 인기 게시글 분석
      const popularArticles = await this.analyzePopularArticles();
      
      // 4. 카테고리별 성과 분석
      const categoryStats = await this.analyzeCategoryPerformance();
      
      // 5. 키워드 성과 분석
      const keywordStats = await this.analyzeKeywordPerformance();
      
      // 6. 트렌드 분석
      const trendAnalysis = await this.analyzeTrends();
      
      // 7. 결과 종합 및 로깅
      const analysis = {
        date: new Date().toISOString().split('T')[0],
        dailyStats,
        popularArticles,
        categoryStats,
        keywordStats,
        trendAnalysis
      };

      await this.logAnalysis(analysis);
      
      logger.info('=== 성과 분석 Job 완료 ===');
      return analysis;
    } catch (error) {
      logger.error('성과 분석 Job 실패:', error);
      throw error;
    }
  }

  /**
   * 일일 통계 수집
   */
  async collectDailyStats() {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

      // 오늘 생성된 게시글 수
      const todayArticles = await this.strapiClient.client.get('/api/articles', {
        params: {
          'filters[publishedAt][$gte]': todayStart.toISOString(),
          'pagination[limit]': 1000
        }
      });

      // 어제 생성된 게시글 수
      const yesterdayArticles = await this.strapiClient.client.get('/api/articles', {
        params: {
          'filters[publishedAt][$gte]': yesterdayStart.toISOString(),
          'filters[publishedAt][$lt]': todayStart.toISOString(),
          'pagination[limit]': 1000
        }
      });

      // 총 게시글 수
      const totalArticles = await this.strapiClient.client.get('/api/articles', {
        params: {
          'pagination[limit]': 1
        }
      });

      return {
        articlesCreatedToday: todayArticles.data.data?.length || 0,
        articlesCreatedYesterday: yesterdayArticles.data.data?.length || 0,
        totalArticles: totalArticles.data.meta?.pagination?.total || 0,
        growthRate: this.calculateGrowthRate(
          todayArticles.data.data?.length || 0,
          yesterdayArticles.data.data?.length || 0
        )
      };
    } catch (error) {
      logger.error('일일 통계 수집 실패:', error);
      return {
        articlesCreatedToday: 0,
        articlesCreatedYesterday: 0,
        totalArticles: 0,
        growthRate: 0
      };
    }
  }

  /**
   * 인기 게시글 분석
   */
  async analyzePopularArticles() {
    try {
      const response = await this.strapiClient.client.get('/api/articles', {
        params: {
          'sort[0]': 'viewCount:desc',
          'pagination[limit]': 10,
          'populate': ['category', 'tags']
        }
      });

      const articles = response.data.data || [];
      
      return articles.map(article => ({
        id: article.id,
        title: article.title,
        viewCount: article.viewCount,
        category: article.category?.name,
        sourceKeyword: article.sourceKeyword,
        trendScore: article.trendScore,
        publishedAt: article.publishedAt
      }));
    } catch (error) {
      logger.error('인기 게시글 분석 실패:', error);
      return [];
    }
  }

  /**
   * 카테고리별 성과 분석
   */
  async analyzeCategoryPerformance() {
    try {
      const categories = await this.strapiClient.getCategories();
      const categoryStats = [];

      for (const category of categories) {
        const response = await this.strapiClient.client.get('/api/articles', {
          params: {
            'filters[category][id][$eq]': category.id,
            'pagination[limit]': 1000,
            'populate': ['category']
          }
        });

        const articles = response.data.data || [];
        const totalViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0);
        const avgViews = articles.length > 0 ? totalViews / articles.length : 0;

        categoryStats.push({
          category: category.name,
          articleCount: articles.length,
          totalViews,
          avgViews: Math.round(avgViews * 10) / 10,
          topArticle: articles.length > 0 ? {
            title: articles[0].title,
            views: articles[0].viewCount
          } : null
        });
      }

      return categoryStats.sort((a, b) => b.totalViews - a.totalViews);
    } catch (error) {
      logger.error('카테고리별 성과 분석 실패:', error);
      return [];
    }
  }

  /**
   * 키워드 성과 분석
   */
  async analyzeKeywordPerformance() {
    try {
      const response = await this.strapiClient.client.get('/api/articles', {
        params: {
          'pagination[limit]': 1000,
          'fields[0]': 'sourceKeyword,viewCount,trendScore'
        }
      });

      const articles = response.data.data || [];
      const keywordStats = {};

      articles.forEach(article => {
        if (article.sourceKeyword) {
          const keyword = article.sourceKeyword;
          if (!keywordStats[keyword]) {
            keywordStats[keyword] = {
              keyword,
              articleCount: 0,
              totalViews: 0,
              avgTrendScore: 0,
              trendScores: []
            };
          }
          
          keywordStats[keyword].articleCount++;
          keywordStats[keyword].totalViews += article.viewCount || 0;
          keywordStats[keyword].trendScores.push(article.trendScore || 0);
        }
      });

      // 평균 트렌드 점수 계산
      Object.values(keywordStats).forEach(stat => {
        stat.avgTrendScore = stat.trendScores.length > 0 ? 
          stat.trendScores.reduce((sum, score) => sum + score, 0) / stat.trendScores.length : 0;
        stat.avgViews = stat.articleCount > 0 ? stat.totalViews / stat.articleCount : 0;
        delete stat.trendScores; // 메모리 절약
      });

      return Object.values(keywordStats)
        .sort((a, b) => b.totalViews - a.totalViews)
        .slice(0, 20); // 상위 20개 키워드
    } catch (error) {
      logger.error('키워드 성과 분석 실패:', error);
      return [];
    }
  }

  /**
   * 트렌드 분석
   */
  async analyzeTrends() {
    try {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const response = await this.strapiClient.client.get('/api/articles', {
        params: {
          'filters[publishedAt][$gte]': lastWeek.toISOString(),
          'sort[0]': 'publishedAt:desc',
          'pagination[limit]': 1000,
          'fields[0]': 'sourceKeyword,trendScore,publishedAt'
        }
      });

      const articles = response.data.data || [];
      
      // 일별 트렌드 점수 평균
      const dailyTrends = {};
      articles.forEach(article => {
        const date = article.publishedAt.split('T')[0];
        if (!dailyTrends[date]) {
          dailyTrends[date] = { scores: [], count: 0 };
        }
        dailyTrends[date].scores.push(article.trendScore || 0);
        dailyTrends[date].count++;
      });

      const trendData = Object.entries(dailyTrends).map(([date, data]) => ({
        date,
        avgTrendScore: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length,
        articleCount: data.count
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        weeklyTrendData: trendData,
        avgWeeklyTrendScore: trendData.length > 0 ? 
          trendData.reduce((sum, day) => sum + day.avgTrendScore, 0) / trendData.length : 0,
        totalArticlesThisWeek: articles.length
      };
    } catch (error) {
      logger.error('트렌드 분석 실패:', error);
      return {
        weeklyTrendData: [],
        avgWeeklyTrendScore: 0,
        totalArticlesThisWeek: 0
      };
    }
  }

  /**
   * 성장률 계산
   */
  calculateGrowthRate(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  }

  /**
   * 분석 결과 로깅
   */
  async logAnalysis(analysis) {
    logger.info('=== 성과 분석 결과 ===');
    logger.info('일일 통계:', analysis.dailyStats);
    logger.info('인기 게시글 TOP 5:', analysis.popularArticles.slice(0, 5));
    logger.info('카테고리별 성과 TOP 3:', analysis.categoryStats.slice(0, 3));
    logger.info('인기 키워드 TOP 5:', analysis.keywordStats.slice(0, 5));
    logger.info('주간 트렌드:', analysis.trendAnalysis);

    // TODO: 추후 데이터베이스에 저장하거나 외부 모니터링 시스템에 전송
    // await this.saveAnalysisToDatabase(analysis);
  }

  /**
   * 성과 리포트 생성
   */
  generateReport(analysis) {
    const report = {
      summary: {
        date: analysis.date,
        totalArticles: analysis.dailyStats.totalArticles,
        articlesCreatedToday: analysis.dailyStats.articlesCreatedToday,
        growthRate: analysis.dailyStats.growthRate
      },
      insights: this.generateInsights(analysis),
      recommendations: this.generateRecommendations(analysis)
    };

    return report;
  }

  /**
   * 인사이트 생성
   */
  generateInsights(analysis) {
    const insights = [];

    // 성장률 인사이트
    if (analysis.dailyStats.growthRate > 0) {
      insights.push(`게시글 생성량이 전일 대비 ${analysis.dailyStats.growthRate}% 증가했습니다.`);
    } else if (analysis.dailyStats.growthRate < 0) {
      insights.push(`게시글 생성량이 전일 대비 ${Math.abs(analysis.dailyStats.growthRate)}% 감소했습니다.`);
    }

    // 카테고리 인사이트
    if (analysis.categoryStats.length > 0) {
      const topCategory = analysis.categoryStats[0];
      insights.push(`'${topCategory.category}' 카테고리가 가장 높은 조회수를 기록했습니다 (${topCategory.totalViews}회).`);
    }

    // 키워드 인사이트
    if (analysis.keywordStats.length > 0) {
      const topKeyword = analysis.keywordStats[0];
      insights.push(`'${topKeyword.keyword}' 키워드가 가장 인기있습니다 (${topKeyword.totalViews}회 조회).`);
    }

    return insights;
  }

  /**
   * 추천사항 생성
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    // 성장률 기반 추천
    if (analysis.dailyStats.growthRate < 0) {
      recommendations.push('게시글 생성량 감소를 해결하기 위해 트렌드 수집 빈도를 늘려보세요.');
    }

    // 카테고리 기반 추천
    if (analysis.categoryStats.length > 0) {
      const lowPerformingCategories = analysis.categoryStats.filter(cat => cat.avgViews < 10);
      if (lowPerformingCategories.length > 0) {
        recommendations.push(`저성과 카테고리 (${lowPerformingCategories.map(c => c.category).join(', ')})의 콘텐츠 품질을 개선해보세요.`);
      }
    }

    // 트렌드 기반 추천
    if (analysis.trendAnalysis.avgWeeklyTrendScore < 5) {
      recommendations.push('트렌드 점수가 낮습니다. 더 인기있는 키워드를 타겟팅해보세요.');
    }

    return recommendations;
  }
}

// 직접 실행 시
if (require.main === module) {
  const job = new AnalyzePerformanceJob();
  job.run()
    .then((analysis) => {
      logger.info('성과 분석 Job 완료');
      const report = job.generateReport(analysis);
      logger.info('성과 리포트:', report);
      process.exit(0);
    })
    .catch((error) => {
      logger.error('성과 분석 Job 실패:', error);
      process.exit(1);
    });
}

module.exports = AnalyzePerformanceJob;
