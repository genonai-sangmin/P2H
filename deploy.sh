#!/bin/bash

# 기존 컨테이너 중지 및 제거
echo "기존 컨테이너 중지 및 제거 중..."
docker-compose down

# 이미지 재빌드
echo "이미지 재빌드 중..."
docker-compose build --no-cache

# 새 컨테이너 시작
echo "새 컨테이너 시작 중..."
docker-compose up -d

# 상태 확인
echo ""
echo "컨테이너 상태:"
docker-compose ps

# 로그 확인
echo ""
echo "백엔드 로그:"
docker-compose logs --tail=20 backend

echo ""
echo "프론트엔드 로그:"
docker-compose logs --tail=20 frontend
