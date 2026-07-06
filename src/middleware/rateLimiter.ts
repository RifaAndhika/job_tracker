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

// Buat limiter khusus route authenticated by userId
export const authenticatedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  store: authenticatedStore,
  keyGenerator: (req) => req.user?.userId ?? "unknown",
  message: { message: "Slow down, too many requests." }, // samakan
});

//for i in {1..11}; do   curl -s -o /dev/null -w "%{http_code}\n"     -X POST http://localhost:3000/api/auth/login     -H "Content-Type: application/json"     -d '{"email":"test@e423.com","password":"234324"}'; done
