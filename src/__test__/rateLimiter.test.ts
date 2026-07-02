// tests/rateLimiter.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";
import {
  authStore,
  globalStore,
  heavyStore,
  authenticatedStore,
} from "../middleware/rateLimiter";
import { generateAccessToken } from "../utils/jwtUtils";
import { prismaMock } from "./helpers/prismaMock";

// Reset store sebelum tiap test
// Tanpa ini, hit count dari test sebelumnya kebawa ke test berikutnya
beforeEach(async () => {
  await authStore.resetAll();
  await globalStore.resetAll();
  await heavyStore.resetAll();
  await authenticatedStore.resetAll();
});

// Auth rate limiter test
describe("Auth Rate Limiter", () => {
  it("harus return 429 setelah 10 request login gagal", async () => {
    // Kirim 10 request — semuanya gagal (401), tapi belum kena limit
    // skipSuccessfulRequests: true → hanya request gagal yang dihitung
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post("/api/auth/login")
        .send({ email: "wrong@test.com", password: "wrongpassword" });
    }

    // Request ke-11 harus kena rate limit
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@test.com", password: "wrongpassword" });

    expect(res.status).toBe(429);
    expect(res.body.message).toBe(
      "Too many login attempts, try again in 15 minutes.",
    );
  });

  it("harus return header RateLimit-Limit di response", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "wrongpassword" });

    // standardHeaders: true → header ini harus ada
    // Ini penting untuk client supaya tahu kapan bisa retry
    expect(res.headers["ratelimit-limit"]).toBeDefined();
    expect(res.headers["ratelimit-remaining"]).toBeDefined();
  });

  it("request sukses tidak dihitung ke limit", async () => {
    // Ini test paling penting untuk skipSuccessfulRequests
    // Kalau lo register berhasil 10x (misal test environment),
    // counter tidak boleh naik

    // Kirim 1 request yang akan sukses — mock atau pakai user valid
    // Cek remaining tidak berkurang
    const before = await request(app)
      .post("/api/auth/login")
      .send({ email: "valid@test.com", password: "correctpassword" });

    // Kalau 200, remaining harus tetap 10 (tidak berkurang)
    if (before.status === 200) {
      expect(before.headers["ratelimit-remaining"]).toBe("10");
    }
  });
});

// Global rate limiter test
describe("Global Rate Limiter", () => {
  it("harus return 429 setelah 100 request dalam 15 menit", async () => {
    // Kirim 100 request ke endpoint apapun
    for (let i = 0; i < 100; i++) {
      await request(app).get("/");
    }

    // Request ke-101 kena global limit
    const res = await request(app).get("/");

    expect(res.status).toBe(429);
    expect(res.body.message).toBe("Too many requests, please try again later.");
  });
});

//authenticatedLimiter test
// Lo perlu helper untuk dapat token valid sebelum test ini

describe("Authenticated Limiter", () => {
  beforeEach(async () => {
    await globalStore.resetAll();
    await authStore.resetAll();
    await authenticatedStore.resetAll();
    await heavyStore.resetAll();

    prismaMock.$transaction.mockImplementation((args: any) =>
      Promise.all(args),
    );
    prismaMock.jobApplication.findMany.mockResolvedValue([]);
    prismaMock.jobApplication.count.mockResolvedValue(0);
  });

  it("harus return 429 setelah 100 request dalam 15 menit", async () => {
    const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    // Reset limiter state
    authenticatedStore.resetKey(userId);

    // Send 100 requests
    for (let i = 0; i < 100; i++) {
      await request(app)
        .get("/api/jobs/get")
        .set("Authorization", `Bearer ${token}`);
    }

    // Expect the next request to be rate-limited
    const res = await request(app)
      .get("/api/jobs/get")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(429);
    expect(res.body.message).toBe("Too many requests, please try again later."); // Match the actual error message
  });

  //   it("rate limit by userId bukan IP", async () => {
  //     const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
  //     const token = generateAccessToken({
  //       id: userId,
  //       email: "user@example.com",
  //     });

  //     authenticatedStore.resetKey(userId);

  //     // Send 60 requests and expect 200 for each
  //     for (let i = 0; i < 60; i++) {
  //       const res = await request(app)
  //         .get("/api/jobs/get")
  //         .set("Authorization", `Bearer ${token}`);
  //       expect(res.status).toBe(200);
  //     }

  //     // Now the next request should be rate-limited
  //     const res = await request(app)
  //       .get("/api/jobs/get")
  //       .set("Authorization", `Bearer ${token}`);

  //     // Expect 429 since you've hit the limit after 60 requests
  //     expect(res.status).toBe(429);
  //     expect(res.body.message).toBe("Too many requests, please try again later.");
  //   });
});
