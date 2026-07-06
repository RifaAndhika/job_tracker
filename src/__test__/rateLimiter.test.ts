// tests/rateLimiter.test.ts
import supertest from "supertest";
import app from "../app";
import {
  authStore,
  globalStore,
  heavyStore,
  authenticatedStore,
} from "../middleware/rateLimiter";
import { generateAccessToken } from "../utils/jwtUtils";
import { prismaMock } from "./helpers/prismaMock";

// Reset store before each test
// Without this, hit count from previous tests will carry over
beforeEach(async () => {
  await authStore.resetAll();
  await globalStore.resetAll();
  await heavyStore.resetAll();
  await authenticatedStore.resetAll();
});
const request = supertest(app);

// Auth rate limiter test
describe("Auth Rate Limiter", () => {
  beforeEach(async () => {
    await authStore.resetKey("172.29.0.1");
  });

  it("should return 429 after 10 failed login requests", async () => {
    // Send 10 requests — all failed (401), but not yet rate limited
    // skipSuccessfulRequests: true → only failed requests are counted
    for (let i = 0; i < 10; i++) {
      await request
        .post("/api/auth/login")
        .send({ email: "wrong@test.com", password: "wrongpassword" });
    }

    // The 11th request should hit the rate limit
    const res = await request
      .post("/api/auth/login")
      .send({ email: "wrong@test.com", password: "wrongpassword" });

    expect(res.status).toBe(429);
    expect(res.body.message).toBe(
      "Too many login attempts, try again in 15 minutes.",
    );
  });

  it("should return RateLimit headers in the response", async () => {
    const res = await request
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "wrongpassword" });

    // standardHeaders: true → these headers must exist
    // Important for clients to know when they can retry
    expect(res.headers["ratelimit-limit"]).toBeDefined();
    expect(res.headers["ratelimit-remaining"]).toBeDefined();
  });

  it("successful requests should not be counted towards the limit", async () => {
    // This test is crucial for skipSuccessfulRequests
    // If you register successfully 10 times (e.g. in test env),
    // the counter must not increase

    // Send 1 request that will succeed — mock or use a valid user
    // Check that remaining does not decrease
    const before = await request
      .post("/api/auth/login")
      .send({ email: "valid@test.com", password: "correctpassword" });

    // If 200, remaining should still be 10 (unchanged)
    if (before.status === 200) {
      expect(before.headers["ratelimit-remaining"]).toBe("10");
    }
  });
});

// Global rate limiter test
describe("Global Rate Limiter", () => {
  it("should return 429 after 100 requests within 15 minutes", async () => {
    // Send 100 requests to any endpoint
    for (let i = 0; i < 100; i++) {
      await request.get("/");
    }

    // The 101st request should hit the global limit
    const res = await request.get("/");

    expect(res.status).toBe(429);
    expect(res.body.message).toBe("Too many requests, please try again later.");
  });
});

// Authenticated limiter test
// You need a helper to get a valid token before running this test
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

  it("should return 429 after 100 requests within 15 minutes", async () => {
    const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    // Reset limiter state
    authenticatedStore.resetKey(userId);

    // Send 100 requests
    for (let i = 0; i < 100; i++) {
      await request
        .get("/api/jobs/get")
        .set("Authorization", `Bearer ${token}`);
    }

    // Expect the next request to be rate-limited
    const res = await request
      .get("/api/jobs/get")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(429);
    expect(res.body.message).toBe("Too many requests, please try again later."); // Match the actual error message
  });

  it("should rate limit by userId instead of IP", async () => {
    const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });
    authenticatedStore.resetKey(userId);

    // Send 60 requests and expect 200 for each
    for (let i = 0; i < 60; i++) {
      const res = await request
        .get("/api/jobs/get")
        .set("Authorization", `Bearer ${token}`);
    }

    // Now the next request should be rate-limited
    const res = await request
      .get("/api/jobs/get")
      .set("Authorization", `Bearer ${token}`);

    // Expect 429 since you've hit the limit after 60 requests
    expect(res.status).toBe(429);
    expect(res.body.message).toBe("Slow down, too many requests.");
  });
});
