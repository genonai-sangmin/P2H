# HPC Docker Deployment Guide

## 📋 필수 요구사항

- Docker 20.10+
- Docker Compose 2.0+

## 🚀 빠른 시작

### 1. 전체 애플리케이션 시작

```bash
cd /Users/sangmin/Desktop/전처리기/hpc
docker-compose up -d
```

### 2. 상태 확인

```bash
docker-compose ps
```

### 3. 로그 확인

```bash
# 전체 로그
docker-compose logs -f

# 백엔드 로그만
docker-compose logs -f backend

# 프론트엔드 로그만
docker-compose logs -f frontend
```

### 4. 서비스 중지

```bash
docker-compose down
```

---

## 📝 서비스 정보

| 서비스 | 포트 | URL |
|--------|------|-----|
| **백엔드 (FastAPI)** | 8000 | http://localhost:8000 |
| **프론트엔드 (Vite)** | 5173 | http://localhost:5173 |

### 백엔드 API 엔드포인트

- `GET /` - 루트 경로
- `GET /show_files` - 문서 목록
- `GET /files/{file_name}` - 파일별 내용 조회

---

## 🔧 개발 환경에서의 사용

### Volume Mounting

두 Dockerfile 모두 source code를 volume으로 mount하여 코드 변경 시 자동으로 반영됩니다:

```bash
# 백엔드: Python 파일 변경 시 자동으로 감지되어 서버 재시작
./back:/app

# 프론트엔드: npm run dev는 자동으로 hot reload 지원
./front:/app
```

### 개별 서비스만 시작

```bash
# 백엔드만 시작
docker-compose up -d backend

# 프론트엔드만 시작
docker-compose up -d frontend
```

---

## 🏗️ 배포 환경 설정

### 프로덕션 빌드 (선택사항)

프로덕션 배포 시 다음과 같이 수정할 수 있습니다:

```yaml
# docker-compose.prod.yml
services:
  backend:
    # ... (동일)
    volumes: []  # Volume 제거
    environment:
      - ENV=production
    
  frontend:
    # ... (동일)
    volumes: []  # Volume 제거
    environment:
      - NODE_ENV=production
    command: ["npm", "run", "build"]
```

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 🔍 문제 해결

### 포트 이미 사용 중

```bash
# 기존 프로세스 확인
lsof -i :8000
lsof -i :5173

# 프로세스 종료
kill -9 <PID>
```

### 컨테이너 재빌드

```bash
# 캐시 무시하고 재빌드
docker-compose build --no-cache

# 다시 시작
docker-compose up -d
```

### 로그 확인

```bash
# 상세 로그 확인
docker-compose logs --tail=100

# 특정 서비스 로그
docker-compose logs backend -f
```

---

## 🌐 네트워킹

- 모든 서비스는 `hpc-network`라는 Docker 네트워크로 연결됨
- 프로덕션 환경에서는 백엔드 컨테이너명인 `backend`를 서비스명으로 사용 가능
- 프론트엔드는 `vite.config.ts`의 proxy 설정을 통해 백엔드와 통신

---

## 📦 이미지 크기

- 백엔드: ~500MB (Python 3.12 slim)
- 프론트엔드: ~300MB (Node 20 alpine)

---

## ✅ Health Check

- 백엔드: 30초 간격으로 `/` 엔드포인트 확인
- 프론트엔드: 30초 간격으로 포트 5173 확인

---

## 📚 유용한 명령어

```bash
# 모든 컨테이너 중지 및 제거
docker-compose down

# 볼륨 포함하여 완전히 제거
docker-compose down -v

# 이미지 빌드 (변경사항만)
docker-compose build

# 특정 서비스만 재시작
docker-compose restart backend

# 컨테이너 내 명령 실행
docker-compose exec backend python -c "import sys; print(sys.version)"
docker-compose exec frontend npm list
```

---

## 🔐 보안 (프로덕션 배포 시)

프로덕션 배포 시 다음을 추가로 고려하세요:

1. **환경 변수 관리**: `.env` 파일 사용
2. **CORS 설정**: `allow_origins` 제한
3. **로깅**: 민감한 정보 제외
4. **리버스 프록시**: Nginx/Traefik 사용
5. **SSL/TLS**: HTTPS 적용

