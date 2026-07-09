# Job Tracker Backend

Job Tracker adalah REST API yang dekembangkan untuk membantu para job seeker memantau progres lamaran pekerjaan dan mengelola
lamaran secara efisien.
Aplikasi ini dibangun dengan modular arsitecture untuk mempermudah pengembangan, sehingga code lebih terstruktur

# Teknologi utama

Node.js + Express — framework utama untuk membangun REST API.

Prisma ORM — akses database yang type-safe dan efisien menggunakan PostgreSQL.

JWT Authentication — sistem autentikasi aman dengan refresh token rotation untuk menjaga sesi pengguna.

Docker — memastikan lingkungan pengembangan dan produksi konsisten.

Vitest + Supertest — pengujian otomatis untuk menjaga kualitas API.

###############################################################################################################

# Getting Started

## Prerequisites

- Docker & Docker Compose
- Node.js 22+

## Run dengan Docker

cp .env.example .env
docker compose up --build

## Run lokal

npm install
npx prisma migrate dev
npm run dev

## Testing

npm test
npm run test:coverage

### POST /api/auth/register

Membuat akun baru untuk user
Tidak perlu membutuhkan token

Request body:
{
"name": "string",
"email": "string",
"password": "string"
}

Response 201:
{

"success": true,
"message": "User registered successfully",
"data": {
"id": "uuid",
"name": "string",
"email": "string",
"createdAt": "datetime"
}
}

Response 400:
{
"success": false,
"message": "User already exists"
}

### POST /api/auth/login

login ke aplikasi
Tidak perlu membutuhkan token
Request body:
{
"email" : "user@example.com",
"password" : "password"
}
Response 200:
{
"success" : true,
"message": "User logged in successfully",
"data": {
"accessToken" : "jwt-access-token",
"refreshToken" : "jwt-refresh-token"
},
}

Response 401:
{
"success": false,
"message": "Invalid email or password"
}
