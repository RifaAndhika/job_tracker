FROM node:22-slim
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install --include=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
EXPOSE 3000
RUN npm run build
CMD ["node", "dist/index.js"]