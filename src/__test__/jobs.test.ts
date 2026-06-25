import supertest from "supertest";
import app from "../app";
import { prismaMock } from "./helpers/prismaMock";
import { generateAccessToken } from "../utils/jwtUtils";
import { ApplicationStatus } from "@prisma/client";

const request = supertest(app);

describe("GET /api/jobs/get", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
  it("should return a list of jobs for the authenticated user", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    const mockJobs = [
      {
        id: "job-123",
        userId: userId,
        companyName: "PT Maju",
        position: "Backend Developer",
        status: ApplicationStatus.APPLIED, // bukan string "APPLIED"
        appliedDate: new Date(),
        source: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prismaMock.jobApplication.findMany.mockResolvedValue(mockJobs);
    prismaMock.jobApplication.count.mockResolvedValue(1);

    // $transaction versi array: Prisma jalankan semua promise di array lalu return array hasilnya
    // Kita simulasikan perilaku itu di mock:
    (prismaMock.$transaction as any).mockImplementation((arg: any) => {
      if (Array.isArray(arg)) return Promise.all(arg);
      return arg(prismaMock); // jaga-jaga kalau ada pemanggilan $transaction versi callback di tempat lain
    });

    const res = await request
      .get("/api/jobs/get")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(prismaMock.jobApplication.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId }),
      }),
    );
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return empty array if user has no job applications", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    prismaMock.jobApplication.findMany.mockResolvedValue([]);
    prismaMock.jobApplication.count.mockResolvedValue(0);
    (prismaMock.$transaction as any).mockImplementation((arg: any) => {
      if (Array.isArray(arg)) return Promise.all(arg);
      return arg(prismaMock);
    });

    const res = await request
      .get("/api/jobs/get")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200); // BUKAN 500 — kamu sendiri yang nulis expect 500 di test asalnya, itu salah
    expect(res.body.data).toEqual([]);
  });
});

describe("POST /api/jobs/create", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
  it("should create a new job application for the authenticated user", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    const job = {
      id: "job-123",
      userId: userId,
      companyName: "PT Maju",
      position: "Backend Developer",
      status: ApplicationStatus.INTERVIEW,
      appliedDate: new Date(),
      source: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.jobApplication.create.mockResolvedValue(job);

    const res = await request
      .post("/api/jobs/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        companyName: "PT Maju",
        position: "Backend Developer",
        status: ApplicationStatus.INTERVIEW,
        appliedDate: new Date().toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.companyName).toBe("PT Maju");
    expect(res.body.data.position).toBe("Backend Developer");
    expect(res.body.data.status).toBe("INTERVIEW");
  });

  it("should return 400 if required fields are missing", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    const res = await request
      .post("/api/jobs/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ position: "Backend Developer" }); // companyName hilang

    expect(res.status).toBe(400);
  });
});

describe("GET /api/jobs/:id", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
  it("should return a job application by ID for the authenticated user", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    prismaMock.jobApplication.findFirst.mockResolvedValue({
      id: "job-123",
      userId: userId, // ← samakan dengan token, bukan "user-123" asal
      companyName: "PT Maju",
      position: "Backend Developer",
      status: "APPLIED",
      appliedDate: new Date(),
      source: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request
      .get("/api/jobs/job-123")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    // INI YANG HILANG: verifikasi Prisma dipanggil dengan filter userId yang benar
    expect(prismaMock.jobApplication.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId }),
      }),
    );
  });

  it("should return 404 if job application is not found", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    prismaMock.jobApplication.findFirst.mockResolvedValue(null);

    const res = await request
      .get("/api/jobs/job-tidak-ada")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe("PUT /api/jobs/:id", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
  it("should update a job application by ID for the authenticated user", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    const existingJob = {
      id: "job-123",
      userId: userId,
      companyName: "PT Maju",
      position: "Backend Developer",
      status: ApplicationStatus.APPLIED, // bukan string "APPLIED"
      appliedDate: new Date(),
      source: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // WAJIB di-mock sekarang, karena service cek findFirst dulu sebelum update
    prismaMock.jobApplication.findFirst.mockResolvedValue(existingJob);

    prismaMock.jobApplication.update.mockResolvedValue({
      ...existingJob,
      status: "INTERVIEW",
    });

    const res = await request
      .put("/api/jobs/job-123")
      .set("Authorization", `Bearer ${token}`)
      .send({
        companyName: "PT Maju",
        position: "Backend Developer",
        status: "INTERVIEW",
        appliedDate: new Date().toISOString(),
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("INTERVIEW");
    expect(prismaMock.jobApplication.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId }),
      }),
    );
  });

  it("should return 404 when job does not exist", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    prismaMock.jobApplication.findFirst.mockResolvedValue(null);

    const res = await request
      .put("/api/jobs/job-tidak-ada")
      .set("Authorization", `Bearer ${token}`)
      .send({
        companyName: "X",
        position: "Y",
        status: "APPLIED",
        appliedDate: new Date().toISOString(),
      });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/jobs/:id", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
  it("deleted job application", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    const existingJob = {
      id: "job-123",
      userId: userId,
      companyName: "PT Maju",
      position: "Backend Developer",
      status: ApplicationStatus.INTERVIEW,
      appliedDate: new Date(),
      source: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.jobApplication.findFirst.mockResolvedValue(existingJob);
    prismaMock.jobApplication.delete.mockResolvedValue(existingJob);
    const res = await request
      .delete("/api/jobs/job-123")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(prismaMock.jobApplication.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId }),
      }),
    );
  });

  it("should return 404 when deleting a job that does not exist or belongs to another user", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    prismaMock.jobApplication.findFirst.mockResolvedValue(null);
    // atau sesuaikan dengan cara route kamu handle not-found — cek dulu implementasinya

    const res = await request
      .delete("/api/jobs/job-tidak-ada")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
