import supertest from "supertest";
import app from "../app";
import { prismaMock } from "./helpers/prismaMock";
import { generateAccessToken } from "../utils/jwtUtils";

const request = supertest(app);

describe("GET /api/jobs/get", () => {
  // 1. Request tanpa token → 401
  it("should return 401 if Authorization header is missing", async () => {
    const res = await request.get("/api/jobs/get");
    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "Unauthorized",
      }),
    );
  });

  it("should return 401 if Authorization header format is invalid", async () => {
    const res = await request
      .get("/api/jobs/get")
      .set("Authorization", "Token abc"); // salah format
    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "Authorization header format invalid",
      }),
    );
  });

  // 2. Token invalid/expired → 401
  it("should return 401 if token is invalid or expired", async () => {
    const res = await request
      .get("/api/jobs/get")
      .set("Authorization", "Bearer token-palsu"); // JWT palsu
    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "Invalid or expired token", // sesuaikan dengan implementasi
      }),
    );
  });

  it("should return 401 if token is not provided after Bearer", async () => {
    const res = await request
      .get("/api/jobs/get")
      .set("Authorization", "Bearer "); // Bearer + spasi
    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "Token not provided",
      }),
    );
  });
});
