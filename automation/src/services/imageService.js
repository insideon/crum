const axios = require('axios');
const logger = require('../utils/logger');

class ImageService {
  constructor() {
    this.unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
    this.cloudinaryConfig = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET
    };
  }

  /**
   * 키워드에 맞는 이미지 검색 및 다운로드
   */
  async getImageForKeyword(keyword, category = '기타') {
    logger.info(`이미지 검색 시작: ${keyword}`);
    
    try {
      // 1. Unsplash에서 이미지 검색
      const imageUrl = await this.searchUnsplashImage(keyword);
      
      if (imageUrl) {
        // 2. 이미지 다운로드
        const imageBuffer = await this.downloadImage(imageUrl);
        
        // 3. Cloudinary에 업로드
        const uploadedImage = await this.uploadToCloudinary(imageBuffer, keyword);
        
        logger.info(`${keyword} 이미지 처리 완료: ${uploadedImage.url}`);
        return uploadedImage;
      }

      // Unsplash 실패 시 대체 이미지 사용
      return await this.getFallbackImage(category);
    } catch (error) {
      logger.error(`이미지 처리 실패 (${keyword}):`, error);
      return await this.getFallbackImage(category);
    }
  }

  /**
   * Unsplash에서 이미지 검색
   */
  async searchUnsplashImage(keyword) {
    try {
      if (!this.unsplashAccessKey) {
        logger.warn('Unsplash API 키가 설정되지 않음');
        return null;
      }

      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: keyword,
          per_page: 1,
          orientation: 'landscape',
          content_filter: 'high'
        },
        headers: {
          'Authorization': `Client-ID ${this.unsplashAccessKey}`
        },
        timeout: 10000
      });

      if (response.data.results && response.data.results.length > 0) {
        const image = response.data.results[0];
        return image.urls.regular; // 고해상도 이미지 URL
      }

      return null;
    } catch (error) {
      logger.warn(`Unsplash 검색 실패 (${keyword}):`, error.message);
      return null;
    }
  }

  /**
   * 이미지 다운로드
   */
  async downloadImage(imageUrl) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      return Buffer.from(response.data);
    } catch (error) {
      logger.error(`이미지 다운로드 실패:`, error);
      throw error;
    }
  }

  /**
   * Cloudinary에 이미지 업로드
   */
  async uploadToCloudinary(imageBuffer, keyword) {
    try {
      if (!this.cloudinaryConfig.cloudName) {
        logger.warn('Cloudinary 설정이 없음, 원본 URL 반환');
        return {
          url: 'https://via.placeholder.com/1200x630/cccccc/666666?text=No+Image',
          alternativeText: keyword
        };
      }

      const FormData = require('form-data');
      const form = new FormData();
      
      form.append('file', imageBuffer, {
        filename: `${keyword}.jpg`,
        contentType: 'image/jpeg'
      });
      form.append('upload_preset', 'crum_blog'); // Cloudinary에서 설정한 preset
      form.append('folder', 'crum-blog');
      form.append('public_id', `article-${keyword}-${Date.now()}`);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            'Authorization': `Basic ${Buffer.from(
              `${this.cloudinaryConfig.apiKey}:${this.cloudinaryConfig.apiSecret}`
            ).toString('base64')}`
          },
          timeout: 30000
        }
      );

      return {
        url: response.data.secure_url,
        alternativeText: keyword,
        width: response.data.width,
        height: response.data.height,
        publicId: response.data.public_id
      };
    } catch (error) {
      logger.error(`Cloudinary 업로드 실패:`, error);
      throw error;
    }
  }

  /**
   * 카테고리별 대체 이미지 제공
   */
  async getFallbackImage(category) {
    const fallbackImages = {
      '뉴스/시사': 'https://via.placeholder.com/1200x630/4a90e2/ffffff?text=News',
      '엔터테인먼트/연예': 'https://via.placeholder.com/1200x630/e74c3c/ffffff?text=Entertainment',
      '기술/IT': 'https://via.placeholder.com/1200x630/2ecc71/ffffff?text=Technology',
      '생활/건강': 'https://via.placeholder.com/1200x630/f39c12/ffffff?text=Lifestyle',
      '경제/재테크': 'https://via.placeholder.com/1200x630/9b59b6/ffffff?text=Finance',
      '요리/맛집': 'https://via.placeholder.com/1200x630/e67e22/ffffff?text=Food',
      '여행/문화': 'https://via.placeholder.com/1200x630/1abc9c/ffffff?text=Travel',
      '스포츠': 'https://via.placeholder.com/1200x630/34495e/ffffff?text=Sports',
      '교육': 'https://via.placeholder.com/1200x630/3498db/ffffff?text=Education',
      '기타': 'https://via.placeholder.com/1200x630/95a5a6/ffffff?text=Article'
    };

    return {
      url: fallbackImages[category] || fallbackImages['기타'],
      alternativeText: category,
      isFallback: true
    };
  }

  /**
   * 이미지 최적화 (리사이징, 압축)
   */
  async optimizeImage(imageBuffer, options = {}) {
    try {
      const sharp = require('sharp');
      
      const {
        width = 1200,
        height = 630,
        quality = 85,
        format = 'jpeg'
      } = options;

      const optimizedBuffer = await sharp(imageBuffer)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality })
        .toBuffer();

      return optimizedBuffer;
    } catch (error) {
      logger.warn('이미지 최적화 실패, 원본 사용:', error.message);
      return imageBuffer;
    }
  }

  /**
   * 이미지 메타데이터 추출
   */
  async extractImageMetadata(imageBuffer) {
    try {
      const sharp = require('sharp');
      const metadata = await sharp(imageBuffer).metadata();
      
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: imageBuffer.length,
        hasAlpha: metadata.hasAlpha
      };
    } catch (error) {
      logger.warn('이미지 메타데이터 추출 실패:', error.message);
      return null;
    }
  }

  /**
   * 이미지 alt 텍스트 생성
   */
  generateAltText(keyword, category) {
    const altTexts = {
      '뉴스/시사': `${keyword} 관련 뉴스 이미지`,
      '엔터테인먼트/연예': `${keyword} 엔터테인먼트 관련 이미지`,
      '기술/IT': `${keyword} 기술 관련 이미지`,
      '생활/건강': `${keyword} 생활 관련 이미지`,
      '경제/재테크': `${keyword} 경제 관련 이미지`,
      '요리/맛집': `${keyword} 요리 관련 이미지`,
      '여행/문화': `${keyword} 여행 관련 이미지`,
      '스포츠': `${keyword} 스포츠 관련 이미지`,
      '교육': `${keyword} 교육 관련 이미지`,
      '기타': `${keyword} 관련 이미지`
    };

    return altTexts[category] || altTexts['기타'];
  }
}

module.exports = ImageService;
