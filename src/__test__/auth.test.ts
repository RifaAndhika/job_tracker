import supertest from "supertest";
import app from "../app";
import { prismaMock } from "./helpers/prismaMock";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateAccessToken } from "../utils/jwtUtils";

const request = supertest(app);
// ============================================================
// POST /api/auth/register
// ============================================================
describe("POST /api/auth/register", () => {
  it("should register a new user successfully", async () => {
    // Simulasi: prisma.user.findUnique tidak menemukan user (belum terdaftar)
    prismaMock.user.findUnique.mockResolvedValue(null);

    // Simulasi: prisma.user.create berhasil membuat user baru
    prismaMock.user.create.mockResolvedValue({
      id: "user-123",
      name: "Faa",
      email: "prabowo@example.com",
      password: "hashedpassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request.post("/api/auth/register").send({
      name: "prabowo",
      email: "prabowo@example.com",
      password: "password123",
    });

    console.log(res.status, res.body);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("prabowo@example.com");
    // Pastikan password tidak ikut terkirim ke response
    expect(res.body.data.password).toBeUndefined();
  });

  it("should return 400 if email already exists", async () => {
    console.log(
      await prismaMock.user.findUnique({
        where: { email: "prabowo@example.com" },
      }),
    );
    // Simulasi: prisma.user.findUnique menemukan user yang sudah ada
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-123",
      name: "prabowo",
      email: "prabowo@example.com",
      password: "hashedpassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request.post("/api/auth/register").send({
      name: "prabowo",
      email: "prabowo@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });
});

// ============================================================
// POST /api/auth/login
// ============================================================
describe("POST /api/auth/login", () => {
  it("should login successfully and return tokens", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Simulasi: user ditemukan di database
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-123",
      name: "prabowo",
      email: "prabowo@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Simulasi: refresh token berhasil disimpan
    prismaMock.refreshToken.create.mockResolvedValue({
      id: "token-123",
      token: "some-refresh-token",
      userId: "4101880a-ba2a-47e2-9ff7-8961686c6f00",
      createdAt: new Date(),
      expiresAt: new Date(),
    });

    const res = await request.post("/api/auth/login").send({
      email: "prabowo@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it("should return 401 if user not found", async () => {
    // Simulasi: user tidak ditemukan
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await request.post("/api/auth/login").send({
      email: "tidakada@example.com",
      password: "password123",
    });

    expect(res.status).toBe(401);
  });

  it("should return 401 if password is wrong", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-123",
      name: "Faa",
      email: "faa@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request.post("/api/auth/login").send({
      email: "faa@example.com",
      password: "passwordSalah",
    });

    expect(res.status).toBe(401);
  });
});

// ============================================================Logout
describe("POST /api/auth/refresh", () => {
  it("should refresh token successfully", async () => {
    const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
    // Simulasi: refresh token berhasil disimpan

    const validRefreshToken = generateRefreshToken({
      id: userId,
      email: "test@example.com",
    });

    const refreshToken = {
      id: "7ccf4c42-078a-4d6a-a8fc-cc5fdf112e0b",
      token: validRefreshToken,
      userId: userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      createdAt: new Date(),
    };

    prismaMock.refreshToken.findUnique.mockResolvedValue(refreshToken);

    const res = await request
      .post("/api/auth/refresh")
      .send({ refreshToken: validRefreshToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("accessToken");
  });
});

describe("POST /api/auth/refresh", () => {
  it("should return 400 if refresh token is required", async () => {
    const res = await request
      .post("/api/auth/refresh")
      .send({ refreshToken: null });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Refresh token is required");
  });
});

describe("POST /api/auth/refresh", () => {
  it("should return 401 if refresh token is invalid", async () => {
    prismaMock.refreshToken.findUnique.mockResolvedValue(null);

    const res = await request
      .post("/api/auth/refresh")
      .send({ refreshToken: "adaawdawywagwy" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid refresh token");
  });
});

describe("POST /api/auth/refresh", () => {
  it("should return 401 if fake jwt/expired token", async () => {
    const fakeToken = "awdadawadawwda";
    const refreshToken = {
      id: "7ccf4c42-078a-4d6a-a8fc-cc5fdf112e0b",
      token: fakeToken,
      userId: "4101880a-ba2a-47e2-9ff7-8961686c6f00",
      expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      createdAt: new Date(),
    };

    prismaMock.refreshToken.findUnique.mockResolvedValue(refreshToken);

    const res = await request
      .post("/api/auth/refresh")
      .send({ refreshToken: fakeToken });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid refresh token");
  });
});

describe("POST /api/auth/logout", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";

  it("should logout successfully and delete all refresh tokens", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    prismaMock.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

    const res = await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verifikasi yang dihapus adalah token milik user yang login
    expect(prismaMock.refreshToken.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId }),
      }),
    );
  });
});
