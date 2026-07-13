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

## POST /api/auth/register

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

## POST /api/auth/refresh

untuk membuat access token baru jika acces token lama sudah expired dengan mengirim refresh token

Request body:
{
"refreshtoken" : "string"
}

Response 200:
{

"success" : true,
"message" : "Access token refreshed successfully",
"data" : {
"accessToken" : "string"
}
}

Response 400:
{

"success" : false,
"message" : "Refresh Token Required"
}
Response 401:
{

"success" : false,
"message" : "Invalid refresh token"
}

## POST /api/auth/logout

untuk logout akan mengambil data userId, dan menghapus refreshToken sesuai user
Requires: Bearer token (Authorization header)

Response 200:
{
"success": true,
"message" : "User logged out successfully"
}

Response 500:
{
"success" : false,
"message" : "Internal Server Error"
}

############################################################

## POST /api/jobs/create

Membuat data lamaran pekerjaan (job application) baru untuk pengguna yang terautentikasi.Memerlukan token akses dan validasi skema data.
Authorization: Bearer (Authorization header)

Request body:
{
"companyName": "string",
"position": "string",
"status": "APPLIED | INTERVIEW | OFFERED | REJECTED",
"appliedDate": "string (ISO Date-Time)",
"source": "string | null",
"notes": "string | null"
}

Response 201:
{
"success": true,
"message": "Job application created successfully",
"data": {
"id": "uuid",
"userId": "uuid",
"companyName": "string",
"position": "string",
"status": "string",
"appliedDate": "datetime",
"source": "string | null",
"notes": "string | null",
"createdAt": "datetime",
"updatedAt": "datetime"
}
}

// Terjadi jika field wajib tidak dikirim atau format data tidak valid (contoh: status bukan salah satu dari enum yang ditentukan).

Response 400:
{
"success": false,
"message": "Validation error"
}

## GET /api/jobs/get

Mengambil daftar lamaran pekerjaan milik pengguna dengan dukungan penyaringan (filtering), pencarian (searching), dan paginasi.Membutuhkan token akses dan dibatasi oleh rate limiter.
Authorization: Bearer (Authorization header)

Response 200:
{
"success": true,
"message": "Job applications retrieved successfully",
"data": [
{
"id": "uuid",
"userId": "uuid",
"companyName": "string",
"position": "string",
"status": "string",
"appliedDate": "datetime",
"createdAt": "datetime",
"updatedAt": "datetime"
}
],
"pagination": {
"total": 1,
"page": 3,
"limit": 25,
"totalPages": 10
}
}

## GET /api/jobs/:id

Mengambil detail satu data lamaran pekerjaan berdasarkan ID.Membutuhkan token akses dan dibatasi oleh rate limiter.
Authorization: Bearer (Authorization header)

Response 200:
{
"success": true,
"message": "Job application retrieved successfully",
"data": {
"id": "uuid",
"userId": "uuid",
"companyName": "string",
"position": "string",
"status": "string",
"appliedDate": "datetime",
"source": "string | null",
"notes": "string | null",
"createdAt": "datetime",
"updatedAt": "datetime"
}
}

Response 404:
{
"success": false,
"message": "Job application not found"
}

## PUT /api/jobs/:id

Memperbarui data lamaran pekerjaan berdasarkan ID.Membutuhkan token akses, dibatasi rate limiter, dan memerlukan validasi skema data.
Authorization: Bearer (Authorization header)

Request body:
{
"companyName": "string Updated",
"position": "string",
"status": "APPLIED | INTERVIEW | OFFERED | REJECTED",
"appliedDate": "string (ISO Date-Time)",
"source": "string | null",
"notes": "string | null"
}

Response 200:
{
"success": true,
"message": "Job application updated successfully",
"data": {
"id": "uuid",
"userId": "uuid",
"companyName": "string Updated",
"position": "string",
"status": "string",
"appliedDate": "datetime",
"source": "string | null",
"notes": "string | null",
"createdAt": "datetime",
"updatedAt": "datetime"
}
}

## DELETE /api/jobs/:id

Menghapus data lamaran pekerjaan berdasarkan ID.

Response 200:
{
"success": true,
"message": "Job application deleted successfully"
}
