# Job Tracker Backend

Job Tracker adalah RESTful API yang dirancang untuk membantu para pencari kerja memantau progres lamaran pekerjaan dan mengelola proses rekrutmen secara efisien. Proyek ini dibangun menggunakan **Modular Architecture** untuk memastikan kode tetap terstruktur, terisolasi dengan baik, dan mudah untuk dikembangkan di masa mendatang.

---

## Teknologi Utama

- **Node.js & Express** — Runtime environment dan framework utama untuk membangun REST API yang cepat dan kokoh.
- **Prisma ORM** — Object-Relational Mapping yang _type-safe_ untuk interaksi database yang efisien.
- **PostgreSQL** — Sistem manajemen database relasional tingkat produksi.
- **JWT Authentication** — Sistem autentikasi aman dengan mekanisme _Refresh Token Rotation_ untuk menjaga sesi pengguna.
- **Docker & Docker Compose** — Standardisasi lingkungan pengembangan dan produksi yang konsisten.
- **Vitest & Supertest** — Kakas pengujian otomatis (_unit & integration testing_) untuk menjamin kualitas kode.
- **Zod** — Validasi skema data _runtime_ pada _request body_ dan _query parameters_.

---

## Memulai (Getting Started)

### Prasyarat (Prerequisites)

- [Docker & Docker Compose](https://docker.com) terinstal.
- [Node.js](https://nodejs.org) versi 22 atau lebih baru.

### Menjalankan dengan Docker

Metode ini direkomendasikan untuk mereplikasi lingkungan produksi secara instan.

```bash
# Salin konfigurasi environment variable
cp .env.example .env

# Build dan jalankan kontainer aplikasi beserta database
docker compose up --build
```

### Menjalankan di Lingkungan Lokal

Jika Anda ingin melakukan pengembangan langsung tanpa Docker container untuk aplikasi:

```bash
# Instal dependensi proyek
npm install

# Jalankan migrasi database menggunakan Prisma
npx prisma migrate dev

# Jalankan server dalam mode pengembangan
npm run dev
```

### Pengujian (Testing)

Proyek ini dilengkapi dengan suite pengujian otomatis untuk menjaga stabilitas API.

```bash
# Menjalankan seluruh pengujian otomatis
npm test

# Menjalankan pengujian sekaligus melihat laporan cakupan kode (coverage report)
npm run test:coverage
```

---

#######################################################################################################

## Dokumentasi API: Autentikasi (`/api/auth`)

### POST /api/auth/register

Membuat akun pengguna baru di dalam sistem.

- **Autentikasi:** Tidak membutuhkan token.

Request Body:

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

Response 201 (Created)

```json
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
```

Response 400 (Bad Request)

```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### POST /api/auth/login

Melakukan autentikasi pengguna ke dalam aplikasi.

- **Autentikasi:** Tidak membutuhkan token.

Request Body:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response 200 (OK) :

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

Response 401 (Unauthorized)

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### POST /api/auth/refresh

Menghasilkan `accessToken` baru yang valid menggunakan _refresh token_ ketika token akses lama telah kedaluwarsa.

- **Autentikasi:** Tidak membutuhkan token akses di header.

Request Body:

```json
{
  "refreshToken": "string"
}
```

Response 200 (OK) :

```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "string"
  }
}
```

Response 400 (Bad Request)

```json
{
  "success": false,
  "message": "Refresh Token Required"
}
```

Response 401 (Unauthorized)

```json
{
  "success": false,
  "message": "Invalid refresh token"
}
```

---

### POST /api/auth/logout

Mengakhiri sesi pengguna saat ini dengan menghapus data _refresh token_ yang valid dari database.

- **Autentikasi:** Membutuhkan Bearer Token.

Header :

- `Authorization`: `Bearer <access_token>`

Response 200 (OK) :

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

####################################################################################################################

## 💼 Dokumentasi API: Manajemen Lamaran Pekerjaan (`/api/jobs`)

### POST /api/jobs/create

Membuat data lamaran pekerjaan (_job application_) baru untuk pengguna yang terautentikasi.

- **Autentikasi:** Membutuhkan Bearer Token.

Header :

- `Authorization`: `Bearer <access_token>`

Request Body:

```json
{
  "companyName": "string",
  "position": "string",
  "status": "APPLIED | SCREENING | INTERVIEW | OFFER | REJECTED | ACCEPTED",
  "appliedDate": "string (ISO Date-Time / YYYY-MM-DD)",
  "source": "string",
  "notes": "string"
}
```

_Catatan: `source` dan `notes` bersifat opsional._

Response 201 (Created)

```json
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
```

Response 400 (Bad Request)

```json
{
  "success": false,
  "message": "Validation error"
}
```

---

### GET /api/jobs/get

Mengambil daftar lamaran pekerjaan milik pengguna dengan fitur penyaringan (_filtering_), pencarian (_searching_), dan paginasi.

- **Autentikasi:** Membutuhkan Bearer Token (Dibatasi oleh _rate limiter_).

Header :

- `Authorization`: `Bearer <access_token>`

#### Query Parameters

| Parameter | Tipe Data     | Deskripsi                                                                            | Nilai Bawaan (Default) |
| :-------- | :------------ | :----------------------------------------------------------------------------------- | :--------------------- |
| `status`  | String (Enum) | Filter status (`APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, `REJECTED`, `ACCEPTED`) | _None_                 |
| `search`  | String        | Pencarian parsial berdasarkan nama perusahaan atau posisi                            | _None_                 |
| `page`    | Number        | Halaman data saat ini (Minimal `1`)                                                  | `1`                    |
| `limit`   | Number        | Jumlah maksimal data per halaman (Minimal `1`, Maksimal `50`)                        | `10`                   |
| `sort`    | String (Enum) | Arah pengurutan data (`asc` atau `desc`)                                             | `desc`                 |
| `sortBy`  | String (Enum) | Kolom acuan pengurutan data (`appliedDate`)                                          | `appliedDate`          |

Response 200 (OK) :

```json
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
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "limit": 10
  }
}
```

---

### GET /api/jobs/:id

Mengambil detail satu data lamaran pekerjaan secara spesifik berdasarkan ID unik.

- **Autentikasi:** Membutuhkan Bearer Token (Dibatasi oleh _rate limiter_).

Header :

- `Authorization`: `Bearer <access_token>`

Response 200 (OK) :

```json
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
```

Response 404 (Not Found):

```json
{
  "success": false,
  "message": "Job application not found"
}
```

---

### PUT /api/jobs/:id

Memperbarui data lamaran pekerjaan tertentu secara menyeluruh berdasarkan ID unik.

- **Autentikasi:** Membutuhkan Bearer Token (Dibatasi oleh _rate limiter_).

Header :

- `Authorization`: `Bearer <access_token>`

Request Body:

```json
{
  "companyName": "string Updated",
  "position": "string",
  "status": "APPLIED | SCREENING | INTERVIEW | OFFER | REJECTED | ACCEPTED",
  "appliedDate": "string (ISO Date-Time / YYYY-MM-DD)",
  "source": "string",
  "notes": "string"
}
```

Response 200 (OK) :

```json
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
```

---

### DELETE /api/jobs/:id

Menghapus rekaman data lamaran pekerjaan dari sistem berdasarkan ID unik.

- **Autentikasi:** Tidak membutuhkan token tambahan (sesuai definisi router utama).

Response 200 (OK) :

```json
{
  "success": true,
  "message": "Job application deleted successfully"
}
```

Response 404 (Not Found):

```json
{
  "success": false,
  "message": "Job application not found or already deleted"
}
```
