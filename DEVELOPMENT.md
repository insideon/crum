# Crum Blog 개발 가이드

## 프로젝트 구조
```
crum/
├── backend/          # Strapi CMS 백엔드
├── frontend/         # Next.js 프론트엔드
├── automation/       # 자동화 스크립트 (Phase 2)
├── docs/            # 문서
├── docker-compose.yml
└── README.md
```

## 로컬 개발 환경 설정

### 1. 백엔드 (Strapi) 실행
```bash
cd backend
npm install
cp env.example .env
npm run develop
```
- 관리자 패널: http://localhost:1337/admin
- API: http://localhost:1337/api

### 2. 프론트엔드 (Next.js) 실행
```bash
cd frontend
npm install
cp env.local.example .env.local
npm run dev
```
- 웹사이트: http://localhost:3000

### 3. Docker로 전체 실행
```bash
docker-compose up
```

## 환경 변수 설정

### 백엔드 (.env)
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=crum-blog-app-keys-1,crum-blog-app-keys-2,crum-blog-app-keys-3,crum-blog-app-keys-4
API_TOKEN_SALT=crum-blog-api-token-salt
ADMIN_JWT_SECRET=crum-blog-admin-jwt-secret
TRANSFER_TOKEN_SALT=crum-blog-transfer-token-salt
JWT_SECRET=crum-blog-jwt-secret
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 프론트엔드 (.env.local)
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Crum Blog"
```

## 배포

### Vercel (프론트엔드)
1. Vercel 계정에 GitHub 저장소 연결
2. 환경 변수 설정:
   - `NEXT_PUBLIC_STRAPI_URL`: 백엔드 URL
   - `NEXT_PUBLIC_SITE_URL`: 프론트엔드 URL
3. 자동 배포 활성화

### Railway (백엔드)
1. Railway 계정에 GitHub 저장소 연결
2. PostgreSQL 데이터베이스 추가
3. 환경 변수 설정:
   - `DATABASE_URL`: PostgreSQL 연결 문자열
   - `ADMIN_JWT_SECRET`: 관리자 JWT 시크릿
   - `API_TOKEN_SALT`: API 토큰 솔트
   - `FRONTEND_URL`: 프론트엔드 URL

## 개발 워크플로우

### 1. 기능 개발
- 기능별 브랜치 생성
- 개발 완료 후 PR 생성
- 코드 리뷰 후 main 브랜치 병합

### 2. 테스트
- 로컬에서 백엔드/프론트엔드 동작 확인
- API 엔드포인트 테스트
- UI/UX 테스트

### 3. 배포
- main 브랜치 푸시 시 자동 배포
- 환경별 설정 확인
- 모니터링 및 로그 확인

## 문제 해결

### 백엔드 문제
- 포트 충돌: 다른 포트 사용 또는 프로세스 종료
- 데이터베이스 연결: SQLite 파일 권한 확인
- API 오류: 로그 확인 및 환경 변수 검증

### 프론트엔드 문제
- 빌드 오류: 의존성 재설치
- API 연결 오류: 백엔드 상태 확인
- 스타일 문제: Tailwind CSS 설정 확인

## 다음 단계 (Phase 2)
- 트렌드 데이터 수집 시스템
- AI 콘텐츠 자동 생성
- 자동화 스케줄러
