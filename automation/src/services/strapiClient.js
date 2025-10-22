const axios = require('axios');
const logger = require('../utils/logger');

class StrapiClient {
  constructor() {
    this.baseURL = process.env.STRAPI_URL || 'http://localhost:1337';
    this.apiToken = process.env.STRAPI_API_TOKEN;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiToken && { 'Authorization': `Bearer ${this.apiToken}` })
      }
    });
  }

  /**
   * 기존 게시글 중복 체크
   */
  async checkArticleExists(keyword) {
    try {
      const response = await this.client.get('/api/articles', {
        params: {
          'filters[sourceKeyword][$eq]': keyword,
          'pagination[limit]': 1
        }
      });

      return response.data.data && response.data.data.length > 0;
    } catch (error) {
      logger.error('게시글 중복 체크 실패:', error.message);
      return false;
    }
  }

  /**
   * 모든 게시글 조회 (중복 체크용)
   */
  async getAllArticles() {
    try {
      const response = await this.client.get('/api/articles', {
        params: {
          'pagination[limit]': 1000,
          'fields[0]': 'sourceKeyword'
        }
      });

      return response.data.data || [];
    } catch (error) {
      logger.error('게시글 목록 조회 실패:', error.message);
      return [];
    }
  }

  /**
   * 카테고리 목록 조회
   */
  async getCategories() {
    try {
      const response = await this.client.get('/api/categories');
      return response.data.data || [];
    } catch (error) {
      logger.error('카테고리 조회 실패:', error.message);
      return [];
    }
  }

  /**
   * 태그 목록 조회
   */
  async getTags() {
    try {
      const response = await this.client.get('/api/tags');
      return response.data.data || [];
    } catch (error) {
      logger.error('태그 조회 실패:', error.message);
      return [];
    }
  }

  /**
   * 카테고리 생성 또는 조회
   */
  async findOrCreateCategory(categoryName) {
    try {
      // 기존 카테고리 조회
      const response = await this.client.get('/api/categories', {
        params: {
          'filters[name][$eq]': categoryName
        }
      });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }

      // 카테고리 생성
      const createResponse = await this.client.post('/api/categories', {
        data: {
          name: categoryName,
          slug: this.generateSlug(categoryName),
          description: `${categoryName} 관련 게시글`,
          order: 0
        }
      });

      return createResponse.data.data;
    } catch (error) {
      logger.error('카테고리 생성/조회 실패:', error.message);
      throw error;
    }
  }

  /**
   * 태그 생성 또는 조회
   */
  async findOrCreateTags(tagNames) {
    const tags = [];
    
    for (const tagName of tagNames) {
      try {
        // 기존 태그 조회
        const response = await this.client.get('/api/tags', {
          params: {
            'filters[name][$eq]': tagName
          }
        });

        if (response.data.data && response.data.data.length > 0) {
          tags.push(response.data.data[0]);
        } else {
          // 태그 생성
          const createResponse = await this.client.post('/api/tags', {
            data: {
              name: tagName,
              slug: this.generateSlug(tagName),
              count: 1
            }
          });

          tags.push(createResponse.data.data);
        }
      } catch (error) {
        logger.error(`태그 ${tagName} 생성/조회 실패:`, error.message);
      }
    }

    return tags;
  }

  /**
   * 게시글 발행
   */
  async publishArticle(articleData) {
    try {
      const response = await this.client.post('/api/articles', {
        data: {
          ...articleData,
          status: 'published',
          publishedAt: new Date().toISOString()
        }
      });

      logger.info(`게시글 발행 성공: ${articleData.title}`);
      return response.data.data;
    } catch (error) {
      logger.error('게시글 발행 실패:', error.message);
      throw error;
    }
  }

  /**
   * 미디어 업로드
   */
  async uploadMedia(fileBuffer, filename, mimeType) {
    try {
      const formData = new FormData();
      formData.append('files', new Blob([fileBuffer], { type: mimeType }), filename);

      const response = await this.client.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data[0];
    } catch (error) {
      logger.error('미디어 업로드 실패:', error.message);
      throw error;
    }
  }

  /**
   * 사이트 설정 조회
   */
  async getSiteConfig() {
    try {
      const response = await this.client.get('/api/site-config');
      return response.data.data;
    } catch (error) {
      logger.error('사이트 설정 조회 실패:', error.message);
      return null;
    }
  }

  /**
   * 슬러그 생성
   */
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  /**
   * 헬스체크
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/api/articles', {
        params: {
          'pagination[limit]': 1
        }
      });

      return response.status === 200;
    } catch (error) {
      logger.error('Strapi 헬스체크 실패:', error.message);
      return false;
    }
  }
}

module.exports = StrapiClient;
