// src/middleware/rateLimiter.ts — ekspos store supaya bisa di-reset
import rateLimit, { MemoryStore } from "express-rate-limit";

// Buat store terpisah per limiter supaya bisa di-reset di test
export const globalStore = new MemoryStore();
export const authStore = new MemoryStore();
export const heavyStore = new MemoryStore();
export const authenticatedStore = new MemoryStore();

// Buat limiter global
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store: globalStore,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

// Buat limiter khusus auth (login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  store: authStore,
  skipSuccessfulRequests: true,
  message: {
    message: "Too many login attempts, try again in 15 minutes.",
    status: 429,
  },
});

// Buat limiter khusus route data banyak ,berat (jobs, dashboard analytics)
export const heavyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  store: heavyStore,
  message: { message: "Slow down, too many requests." },
});

// Rate limiter khusus untuk user yang sudah login
export const authenticatedLimiter = rateLimit({
  // windowMs: periode waktu per user (15 menit)
  windowMs: 15 * 60 * 1000,

  // max: jumlah maksimal request dalam periode waktu (60 request per 15 menit)
  max: 60,

  // store: tempat penyimpanan data hitungan request (misalnya Redis atau MemoryStore)
  store: authenticatedStore,

  // keyGenerator: cara menentukan "identitas" user untuk dihitung limitnya
  // di sini pakai userId dari token JWT, kalau tidak ada pakai "unknown"
  keyGenerator: (req) => req.user?.userId ?? "unknown",

  // message: respon yang dikirim kalau user melewati batas limit
  message: { message: "Slow down, too many requests." }, // samakan format pesan
});

//Global limiter biasanya pakai req.ip sebagai key. Jadi cukup spam request dari IP yang sama:
// for i in {1..101}; do
//   curl -s -o /dev/null -w "%{http_code}\n" \
//     -X GET http://localhost:3000/api/public
// done

//authLimiter
//for i in {1..11}; do   curl -s -o /dev/null -w "%{http_code}\n"     -X POST http://localhost:3000/api/auth/login     -H "Content-Type: application/json"     -d '{"email":"test@e423.com","password":"234324"}'; done

// # User A (tokenA) kirim 61 request
// for i in {1..61}; do
//   curl -s -o /dev/null -w "%{http_code}\n" \
//     -X GET http://localhost:3000/api/dashboard \
//     -H "Authorization: Bearer tokenA"
// done

// # User B (tokenB) kirim 10 request
// for i in {1..10}; do
//   curl -s -o /dev/null -w "%{http_code}\n" \
//     -X GET http://localhost:3000/api/dashboard \
//     -H "Authorization: Bearer tokenB"
// done
