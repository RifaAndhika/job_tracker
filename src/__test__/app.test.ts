import supertest from "supertest";
import app from "../app";
import { AppError } from "../utils/appError";

const request = supertest(app);

describe("GET /", () => {
  it("should return welcome message", async () => {
    const res = await request.get("/");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Welcome to job-tracker!");
  });
});

describe("GET /notfound", () => {
  it("should return 404 for unknown route", async () => {
    const res = await request.get("/notfound");
    expect(res.status).toBe(404);
  });
});

describe("errorMiddleware", () => {
  it("should return 400 for AppError", async () => {
    const res = await request.get("/error-test");
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "Test error",
      }),
    );
  });

  it("should return 500 for Internal Server Error", async () => {
    const res = await request.get("/error-test-500");
    expect(res.status).toBe(500);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "Internal Server Error", // fallback dari middleware
      }),
    );
  });
});
