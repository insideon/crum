#!/bin/bash

# Crum Blog 개발 환경 설정 스크립트

echo "🚀 Crum Blog 개발 환경 설정을 시작합니다..."

# 백엔드 설정
echo "📦 백엔드 의존성 설치 중..."
cd backend
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ 백엔드 환경 변수 파일 생성 완료"
fi
npm install
echo "✅ 백엔드 의존성 설치 완료"

# 프론트엔드 설정
echo "📦 프론트엔드 의존성 설치 중..."
cd ../frontend
if [ ! -f .env.local ]; then
    cp env.local.example .env.local
    echo "✅ 프론트엔드 환경 변수 파일 생성 완료"
fi
npm install
echo "✅ 프론트엔드 의존성 설치 완료"

echo ""
echo "🎉 개발 환경 설정이 완료되었습니다!"
echo ""
echo "다음 명령어로 개발 서버를 시작하세요:"
echo ""
echo "백엔드 (터미널 1):"
echo "  cd backend && npm run develop"
echo ""
echo "프론트엔드 (터미널 2):"
echo "  cd frontend && npm run dev"
echo ""
echo "또는 Docker 사용:"
echo "  docker-compose up"
echo ""
echo "📚 자세한 내용은 DEVELOPMENT.md를 참조하세요."
