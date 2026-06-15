# 1. Base image: OS + runtime yang dipakai
FROM node:22-slim

# 2. Install OpenSSL (dibutuhkan Prisma)
RUN apt-get update -y && apt-get install -y openssl

# 3. Set working directory di dalam container
WORKDIR /app

# 4. Copy package.json dulu (agar layer cache efisien)
#    Kalau package.json tidak berubah, Docker skip npm install
COPY package*.json ./

# 5. Install semua dependencies termasuk devDependencies (untuk build TypeScript)
RUN npm install --include=dev

# 6. Copy folder prisma agar prisma generate bisa jalan
COPY prisma ./prisma

# 7. Generate Prisma Client dari schema.prisma
RUN npx prisma generate

# 8. Copy semua source code ke dalam container
COPY . .

# 9. Buka port 3000 (dokumentasi, tidak benar-benar membuka port)
EXPOSE 3000

# 10. Compile TypeScript → JavaScript (output ke folder dist/)
RUN npm run build

# 11. Perintah yang dijalankan saat container start
CMD ["node", "dist/index.js"]