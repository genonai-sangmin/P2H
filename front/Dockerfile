# Node.js 20 알파인 이미지 사용 (가벼움)
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 애플리케이션 코드 복사
COPY . .

# 포트 노출
EXPOSE 2000

# 개발 서버 시작
CMD ["npm", "run", "dev"]
