import supertest from "supertest";
import app from "../app";
import { prismaMock } from "./helpers/prismaMock";
import { generateAccessToken } from "../utils/jwtUtils";
import { ApplicationStatus } from "@prisma/client";

const request = supertest(app);

describe("GET /api/jobs", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
  const token = generateAccessToken({ id: userId, email: "user@example.com" });

  // 1. Happy path — tanpa filter (branch false untuk status & search)
  it("should return 200 with all jobs", async () => {
    prismaMock.$transaction.mockResolvedValue([
      [
        {
          id: "job-1",
          companyName: "Google",
          position: "SWE",
          status: "APPLIED",
        },
      ],
      1,
    ]);

    const res = await request
      .get("/api/jobs/get")
      .set("Authorization", `Bearer ${token}`)
      .query({ page: 1, limit: 10, sort: "desc", sortBy: "appliedDate" });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  // 2. Dengan filter status & search (branch true untuk keduanya)
  it("should return 200 with filtered jobs", async () => {
    prismaMock.$transaction.mockResolvedValue([[], 0]);

    const res = await request
      .get("/api/jobs/get")
      .set("Authorization", `Bearer ${token}`)
      .query({
        page: 1,
        limit: 10,
        sort: "desc",
        sortBy: "appliedDate",
        status: "APPLIED",
        search: "google",
      });

    expect(res.status).toBe(200);
  });
});
//GET
describe("GET /api/jobs/get", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";

  it("should return a list of jobs for the authenticated user", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    const mockJobs = [
      {
        id: "06dc488a-d4ac-4e53-bfd1-6b34645d94b7",
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

  it("should return 400 validation error if request body is invalid", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });
    const res = await request
      .get("/api/jobs/get")
      .set("Authorization", `Bearer ${token}`)
      .query({ page: -1, limit: 999, sort: "INVALID" }); // invalid values
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "Validation error",
      }),
    );
  });
});

//POST
describe("POST /api/jobs/create", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";

  it("should create a new job application for the authenticated user", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    const job = {
      id: "06dc488a-d4ac-4e53-bfd1-6b34645d94b7",
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

  //validate middleware
  it("should return 400 if request body is invalid", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });
    const res = await request
      .post("/api/jobs/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ position: "Backend Developer", status: "INVALID_STATUS" }); // invalid status
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "Validation error",
      }),
    );
    expect(res.body.data).toBeUndefined();
  });
});

//GET BY ID
describe("GET /api/jobs/:id", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";

  it("should return a job application by ID for the authenticated user", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    prismaMock.jobApplication.findFirst.mockResolvedValue({
      id: "06dc488a-d4ac-4e53-bfd1-6b34645d94b7",
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
      .get("/api/jobs/06dc488a-d4ac-4e53-bfd1-6b34645d94b7")
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

//PUT
describe("PUT /api/jobs/:id", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";

  it("should update a job application by ID for the authenticated user", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    const job = {
      id: "06dc488a-d4ac-4e53-bfd1-6b34645d94b7",
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
    prismaMock.jobApplication.findFirst.mockResolvedValue(job);

    prismaMock.jobApplication.update.mockResolvedValue({
      ...job,
      status: ApplicationStatus.INTERVIEW,
    });

    const res = await request
      .put("/api/jobs/06dc488a-d4ac-4e53-bfd1-6b34645d94b7")
      .set("Authorization", `Bearer ${token}`)
      .send({
        companyName: "PT Maju",
        position: "Backend Developer",
        status: ApplicationStatus.INTERVIEW,
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

  // 3. Update dengan field invalid → 400
  it("should return 400 if update data is invalid", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });
    const res = await request
      .put("/api/jobs/06dc488a-d4ac-4e53-bfd1-6b34645d94b7")
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "STATUS_TIDAK_VALID" });
    expect(res.status).toBe(400);
  });
});

//DELETE
describe("DELETE /api/jobs/:id", () => {
  const userId = "4101880a-ba2a-47e2-9ff7-8961686c6f00";
  it("should delete a job application for the authenticated user", async () => {
    const token = generateAccessToken({
      id: userId,
      email: "user@example.com",
    });

    const job = {
      id: "06dc488a-d4ac-4e53-bfd1-6b34645d94b7",
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

    prismaMock.jobApplication.findFirst.mockResolvedValue(job);
    prismaMock.jobApplication.delete.mockResolvedValue(job);
    const res = await request
      .delete("/api/jobs/06dc488a-d4ac-4e53-bfd1-6b34645d94b7")
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
