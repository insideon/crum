# Crum Blog 자동화 시스템

AI 기반 자동화 블로그를 위한 트렌드 수집, 콘텐츠 생성, 성과 분석 시스템입니다.

## 🚀 주요 기능

### 1. 트렌드 데이터 수집
- **Google Trends API**: 실시간 인기 검색어 수집
- **네이버 실시간 검색어**: Puppeteer를 이용한 크롤링
- **뉴스 헤드라인**: Cheerio를 이용한 키워드 추출
- **소셜 미디어**: Twitter 트렌딩 해시태그 수집
- **자동 분류**: 키워드를 카테고리별로 자동 분류
- **중복 제거**: 기존 게시글과 중복되는 키워드 필터링

### 2. AI 콘텐츠 자동 생성
- **OpenAI GPT-4o-mini**: 고품질 콘텐츠 생성
- **키워드 리서치**: Google Search, News API, Wikipedia 연동
- **품질 검증**: 길이, 키워드 밀도, 금칙어 필터링
- **SEO 최적화**: 메타 태그, 슬러그, 구조화 데이터 생성
- **이미지 처리**: Unsplash API, Cloudinary 업로드

### 3. 성과 분석 및 모니터링
- **일일 통계**: 게시글 생성량, 성장률 분석
- **인기 콘텐츠**: 조회수 기반 인기 게시글 분석
- **카테고리별 성과**: 카테고리별 조회수 및 성과 분석
- **키워드 분석**: 키워드별 성과 및 트렌드 점수 분석
- **트렌드 분석**: 주간 트렌드 변화 추적

## 📋 시스템 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn
- Strapi CMS 백엔드
- OpenAI API 키
- (선택사항) Google Search API 키
- (선택사항) Unsplash API 키
- (선택사항) Cloudinary 계정

## 🛠 설치 및 설정

### 1. 의존성 설치
```bash
cd automation
npm install
```

### 2. 환경 변수 설정
```bash
cp env.example .env
```

`.env` 파일을 편집하여 필요한 API 키들을 설정하세요:

```env
# 필수 설정
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token
OPENAI_API_KEY=your-openai-api-key

# 선택사항
GOOGLE_SEARCH_API_KEY=your-google-search-api-key
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

### 3. 스케줄러 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

## 📅 스케줄링

자동화 시스템은 다음과 같은 스케줄로 실행됩니다:

- **트렌드 수집**: 매 2시간마다 (`0 */2 * * *`)
- **콘텐츠 생성**: 매 3시간마다 (`0 */3 * * *`)
- **성과 분석**: 매일 새벽 3시 (`0 3 * * *`)
- **데이터 정리**: 매주 일요일 새벽 4시 (`0 4 * * 0`)

## 🔧 수동 실행

개별 Job을 수동으로 실행할 수 있습니다:

```bash
# 트렌드 수집만 실행
npm run collect-trends

# 콘텐츠 생성만 실행
npm run generate-content

# 성과 분석만 실행
npm run analyze-performance
```

## 📊 모니터링

### 헬스체크 엔드포인트
환경 변수 `ENABLE_HEALTH_ENDPOINT=true`로 설정하면 헬스체크 서버가 실행됩니다:

```bash
curl http://localhost:3001/health
```

### 로그 확인
```bash
# 실시간 로그 확인
tail -f logs/combined.log

# 에러 로그만 확인
tail -f logs/error.log
```

## 🏗 아키텍처

```
automation/
├── src/
│   ├── services/           # 핵심 서비스
│   │   ├── trendCollector.js      # 트렌드 수집
│   │   ├── contentGenerator.js    # 콘텐츠 생성
│   │   ├── imageService.js        # 이미지 처리
│   │   ├── seoOptimizer.js        # SEO 최적화
│   │   └── strapiClient.js        # Strapi 연동
│   ├── jobs/               # 실행 Job
│   │   ├── collectTrends.js       # 트렌드 수집 Job
│   │   ├── generateContent.js    # 콘텐츠 생성 Job
│   │   └── analyzePerformance.js  # 성과 분석 Job
│   ├── utils/              # 유틸리티
│   │   └── logger.js              # 로깅 시스템
│   └── index.js            # 메인 스케줄러
├── logs/                   # 로그 파일
├── package.json
└── env.example
```

## 🔍 주요 서비스 설명

### TrendCollector
- 다양한 소스에서 트렌드 키워드 수집
- 키워드 카테고리 자동 분류
- 트렌드 점수 계산 및 중복 제거

### ContentGenerator
- OpenAI API를 이용한 고품질 콘텐츠 생성
- 키워드 리서치 및 품질 검증
- 재시도 로직 및 에러 핸들링

### ImageService
- Unsplash API를 이용한 이미지 검색
- Cloudinary를 이용한 이미지 업로드 및 최적화
- 카테고리별 대체 이미지 제공

### SEOOptimizer
- URL 친화적 슬러그 생성
- SEO 메타 태그 최적화
- 키워드 밀도 조정 및 구조화 데이터 생성

## 🚨 문제 해결

### 일반적인 문제들

1. **Strapi 연결 실패**
   - Strapi 서버가 실행 중인지 확인
   - API 토큰이 올바른지 확인
   - 네트워크 연결 상태 확인

2. **OpenAI API 오류**
   - API 키가 올바른지 확인
   - API 사용량 한도 확인
   - 네트워크 연결 상태 확인

3. **이미지 업로드 실패**
   - Cloudinary 설정 확인
   - 이미지 파일 크기 확인
   - 네트워크 연결 상태 확인

### 로그 레벨 조정
```env
LOG_LEVEL=debug  # 더 자세한 로그
LOG_LEVEL=error  # 에러만 로그
```

## 📈 성능 최적화

### API 비용 절약
- `REQUEST_DELAY` 환경 변수로 요청 간격 조정
- `ARTICLES_PER_DAY`로 일일 생성량 제한
- GPT-4o-mini 사용으로 비용 절약

### 메모리 최적화
- 로그 파일 자동 로테이션
- 오래된 데이터 정리 스케줄
- 이미지 버퍼 최적화

## 🔄 업데이트 및 유지보수

### 정기 점검사항
- 로그 파일 크기 확인
- API 사용량 모니터링
- 성과 분석 결과 검토
- 에러 로그 확인

### 백업
- 환경 변수 파일 백업
- 로그 파일 백업
- 설정 파일 백업

## 📞 지원

문제가 발생하거나 질문이 있으시면:
1. 로그 파일 확인
2. 환경 변수 설정 검토
3. 네트워크 연결 상태 확인
4. API 키 유효성 확인

---

**Crum Blog 자동화 시스템 v1.0**
