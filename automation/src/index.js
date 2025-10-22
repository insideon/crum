require('dotenv').config();
const cron = require('node-cron');
const logger = require('./utils/logger');
const CollectTrendsJob = require('./jobs/collectTrends');

class AutomationScheduler {
  constructor() {
    this.jobs = {
      collectTrends: new CollectTrendsJob()
    };
    this.isRunning = false;
  }

  /**
   * 스케줄러 시작
   */
  start() {
    if (this.isRunning) {
      logger.warn('스케줄러가 이미 실행 중입니다.');
      return;
    }

    logger.info('=== Crum Blog 자동화 스케줄러 시작 ===');
    this.isRunning = true;

    // 매 2시간마다: 트렌드 수집
    cron.schedule('0 */2 * * *', async () => {
      logger.info('스케줄된 트렌드 수집 시작');
      try {
        await this.jobs.collectTrends.run();
      } catch (error) {
        logger.error('스케줄된 트렌드 수집 실패:', error);
      }
    }, {
      scheduled: true,
      timezone: 'Asia/Seoul'
    });

    // 매 3시간마다: 콘텐츠 생성 (하루 8회)
    cron.schedule('0 */3 * * *', async () => {
      logger.info('스케줄된 콘텐츠 생성 시작');
      try {
        // TODO: 콘텐츠 생성 Job 구현 후 활성화
        // await this.jobs.generateContent.run();
        logger.info('콘텐츠 생성 Job은 Phase 2-2에서 구현 예정');
      } catch (error) {
        logger.error('스케줄된 콘텐츠 생성 실패:', error);
      }
    }, {
      scheduled: true,
      timezone: 'Asia/Seoul'
    });

    // 매일 새벽 3시: 성과 분석 및 정리
    cron.schedule('0 3 * * *', async () => {
      logger.info('스케줄된 성과 분석 시작');
      try {
        // TODO: 성과 분석 Job 구현 후 활성화
        // await this.jobs.analyzePerformance.run();
        logger.info('성과 분석 Job은 Phase 2-3에서 구현 예정');
      } catch (error) {
        logger.error('스케줄된 성과 분석 실패:', error);
      }
    }, {
      scheduled: true,
      timezone: 'Asia/Seoul'
    });

    // 매주 일요일 새벽 4시: 오래된 트렌드 정리
    cron.schedule('0 4 * * 0', async () => {
      logger.info('스케줄된 데이터 정리 시작');
      try {
        await this.cleanupOldData();
      } catch (error) {
        logger.error('스케줄된 데이터 정리 실패:', error);
      }
    }, {
      scheduled: true,
      timezone: 'Asia/Seoul'
    });

    logger.info('모든 스케줄이 등록되었습니다.');
    logger.info('- 트렌드 수집: 매 2시간마다');
    logger.info('- 콘텐츠 생성: 매 3시간마다 (구현 예정)');
    logger.info('- 성과 분석: 매일 새벽 3시 (구현 예정)');
    logger.info('- 데이터 정리: 매주 일요일 새벽 4시');
  }

  /**
   * 스케줄러 중지
   */
  stop() {
    if (!this.isRunning) {
      logger.warn('스케줄러가 실행 중이 아닙니다.');
      return;
    }

    logger.info('자동화 스케줄러 중지 중...');
    cron.getTasks().forEach(task => task.destroy());
    this.isRunning = false;
    logger.info('자동화 스케줄러가 중지되었습니다.');
  }

  /**
   * 수동으로 트렌드 수집 실행
   */
  async runTrendCollection() {
    logger.info('수동 트렌드 수집 실행');
    try {
      return await this.jobs.collectTrends.run();
    } catch (error) {
      logger.error('수동 트렌드 수집 실패:', error);
      throw error;
    }
  }

  /**
   * 오래된 데이터 정리
   */
  async cleanupOldData() {
    logger.info('오래된 데이터 정리 시작');
    
    try {
      // 로그 파일 정리 (30일 이상 된 파일)
      const fs = require('fs');
      const path = require('path');
      const logDir = path.join(__dirname, '../logs');
      
      if (fs.existsSync(logDir)) {
        const files = fs.readdirSync(logDir);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        files.forEach(file => {
          const filePath = path.join(logDir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime < thirtyDaysAgo) {
            fs.unlinkSync(filePath);
            logger.info(`오래된 로그 파일 삭제: ${file}`);
          }
        });
      }

      // TODO: Redis 캐시 정리
      // TODO: 임시 트렌드 데이터 정리
      
      logger.info('데이터 정리 완료');
    } catch (error) {
      logger.error('데이터 정리 실패:', error);
    }
  }

  /**
   * 헬스체크
   */
  async healthCheck() {
    const health = {
      status: 'ok',
      uptime: process.uptime(),
      isRunning: this.isRunning,
      jobs: {
        collectTrends: 'active',
        generateContent: 'pending', // Phase 2-2에서 구현
        analyzePerformance: 'pending' // Phase 2-3에서 구현
      },
      lastRun: {
        trendCollection: 'N/A', // TODO: 마지막 실행 시간 추적
        contentGeneration: 'N/A',
        performanceAnalysis: 'N/A'
      }
    };

    logger.info('헬스체크 결과:', health);
    return health;
  }
}

// 직접 실행 시
if (require.main === module) {
  const scheduler = new AutomationScheduler();
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    logger.info('SIGINT 신호 수신, 스케줄러 종료 중...');
    scheduler.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM 신호 수신, 스케줄러 종료 중...');
    scheduler.stop();
    process.exit(0);
  });

  // 스케줄러 시작
  scheduler.start();

  // 헬스체크 엔드포인트 (선택사항)
  if (process.env.ENABLE_HEALTH_ENDPOINT === 'true') {
    const express = require('express');
    const app = express();
    const port = process.env.HEALTH_PORT || 3001;

    app.get('/health', async (req, res) => {
      try {
        const health = await scheduler.healthCheck();
        res.json(health);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.listen(port, () => {
      logger.info(`헬스체크 서버가 포트 ${port}에서 실행 중입니다.`);
    });
  }
}

module.exports = AutomationScheduler;
