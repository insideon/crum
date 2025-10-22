# Docker 설정
# 로컬 개발 및 배포를 위한 Docker 설정

FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 포트 노출
EXPOSE 1337

# 시작 명령어
CMD ["npm", "start"]
