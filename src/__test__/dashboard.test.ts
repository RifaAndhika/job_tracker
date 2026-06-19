import supertest from "supertest"; 
import app from "../app";
import { prismaMock } from "./helpers/prismaMock";
import { generateAccessToken} from "../utils/jwtUtils";
import * as service from "../modules/dashboard/dashboard.service"
import { count } from "node:console";
import { prisma } from "../config/prisma";
import { Mock } from "vitest";


const request =  supertest(app);

describe("GET /api/dashboard/analytics" , () => {
    it("should get total jobs application", async () => {
        const  token = generateAccessToken({id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com"});
           prismaMock.jobApplication.count.mockResolvedValue(67);
        
        const res = await request
            .get("/api/dashboard/analytics")
            .set("Authorization", `Bearer ${token}`);


            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBe(67);
        
    });
});



describe("GET /api/dashboard/analytics/by-status", () => {
  it("should calculate total applications grouped by status correctly", async () => {
    const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });
    const groupByMock = prismaMock.jobApplication.groupBy as unknown as Mock;
    // Mock return value dari prisma.jobApplication.groupBy
    // Bentuknya HARUS sama seperti yang Prisma groupBy beneran return:
    // array of object dengan key sesuai field "by", plus "_count"
    groupByMock.mockResolvedValue([
      { status: "APPLIED", _count: { status: 5 } },
      { status: "ACCEPTED", _count: { status: 2 } },
      { status: "REJECTED", _count: { status: 3 } },
    ] as any);
    // "as any" dipakai karena tipe return groupBy Prisma sangat ketat/generic,
    // kadang TypeScript susah infer otomatis di context mock. Boleh dihindari
    // kalau kamu sudah tahu generic type signature aslinya.

    const res = await request
      .get("/api/dashboard/analytics/by-status")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verifikasi hasil AGREGASI manual yang sama seperti logic di service:
    // total = 5+2+3 = 10, lalu masing-masing status diisi sesuai count-nya,
    // status yang TIDAK ada di mock (SCREENING, INTERVIEW, OFFER) harus tetap 0
    expect(res.body.data).toEqual({
      total: 10,
      APPLIED: 5,
      SCREENING: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 3,
      ACCEPTED: 2,
    });
  });

  it("should return all zeros when user has no applications", async () => {
    const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });
    const groupByMock = prismaMock.jobApplication.groupBy as unknown as Mock;
    // Edge case: groupBy return array kosong kalau tidak ada data sama sekali
    groupByMock.mockResolvedValue([]);

    const res = await request
      .get("/api/dashboard/analytics/by-status")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data).toEqual({
      total: 0,
      APPLIED: 0,
      SCREENING: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
      ACCEPTED: 0,
    });
  });
});


    describe("GET /api/dashboard/analytics/monthly", () => {
    it("should return total job applications grouped by month", async () => {
        const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });

        // Mock $queryRaw — return raw hasil SQL, BUKAN hasil setelah di-.map()
        // karena .map()-nya dijalankan SETELAH query, di dalam service yang sama
        prismaMock.$queryRaw.mockResolvedValue([
        { month: "2026-04", count: 5 },
        { month: "2026-05", count: 8 },
        ]);

        const res = await request
        .get("/api/dashboard/analytics/monthly")
        .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        // Hasil akhir setelah .map() Number(item.count) dijalankan
        expect(res.body.data).toEqual([
        { month: "2026-04", count: 5 },
        { month: "2026-05", count: 8 },
        ]);
    });

    it("should return empty array when there is no data", async () => {
        const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });

        prismaMock.$queryRaw.mockResolvedValue([]);

        const res = await request
        .get("/api/dashboard/analytics/monthly")
        .set("Authorization", `Bearer ${token}`);

        expect(res.body.data).toEqual([]);
    });
    });



    describe("GET /api/dashboard/analytics/accepted-rate", () => {
    it("should calculate accepted rate correctly", async () => {
        const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });

        // Service manggil prisma.jobApplication.count() DUA KALI berturut-turut:
        // panggilan 1 = total (tanpa filter status)
        // panggilan 2 = accepted (filter status: ACCEPTED)
        // mockResolvedValueOnce dipakai berurutan supaya tiap panggilan dapat nilai beda
        prismaMock.jobApplication.count
        .mockResolvedValueOnce(20)  // total
        .mockResolvedValueOnce(5);  // accepted

        const res = await request
        .get("/api/dashboard/analytics/accepted-rate")
        .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        // (5/20)*100 = 25, dibulatkan Math.round → tetap 25
        expect(res.body.data).toBe(25);
    });

    it("should round the rate correctly", async () => {
        const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });

        // Sengaja pilih angka yang hasil baginya tidak bulat,
        // supaya Math.round() di service benar-benar teruji
        prismaMock.jobApplication.count
        .mockResolvedValueOnce(3)   // total
        .mockResolvedValueOnce(1);  // accepted

        const res = await request
        .get("/api/dashboard/analytics/accepted-rate")
        .set("Authorization", `Bearer ${token}`);

        // (1/3)*100 = 33.33... → Math.round → 33
        expect(res.body.data).toBe(33);
    });

    it("should return 0 when there are no applications", async () => {
        const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });

        prismaMock.jobApplication.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

        const res = await request
        .get("/api/dashboard/analytics/accepted-rate")
        .set("Authorization", `Bearer ${token}`);

        expect(res.body.data).toBe(0);
    });
    });

        describe("GET /api/dashboard/analytics/overview", () => {
        it("should get job applications overview", async () => {
            const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });

            // count dipanggil 3x total, harus diisi 3 kali berurutan:
            // ke-1: totalApplicationsService → total semua job
            // ke-2: getAcceptedRateService → total (lagi, untuk hitung rate)
            // ke-3: getAcceptedRateService → accepted
            prismaMock.jobApplication.count
            .mockResolvedValueOnce(20)  // totalApplications
            .mockResolvedValueOnce(20)  // total (dalam acceptedRate)
            .mockResolvedValueOnce(5);  // accepted (dalam acceptedRate)

            // groupBy dipanggil 1x → totalApplicationsByStatusService
            (prismaMock.jobApplication.groupBy as any).mockResolvedValue([
            { status: "APPLIED", _count: { status: 15 } },
            { status: "ACCEPTED", _count: { status: 5 } },
            ]);

            // $queryRaw dipanggil 1x → totalApplicationsMonthlyService
            prismaMock.$queryRaw.mockResolvedValue([
            { month: "2026-05", count: 12 },
            { month: "2026-06", count: 8 },
            ]);

            const res = await request
            .get("/api/dashboard/analytics/overview")
            .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            expect(res.body.data).toEqual({
            totalApplications: 20,
            statusStats: {
                total: 20,
                APPLIED: 15,
                SCREENING: 0,
                INTERVIEW: 0,
                OFFER: 0,
                REJECTED: 0,
                ACCEPTED: 5,
            },
            monthlyStats: [
                { month: "2026-05", count: 12 },
                { month: "2026-06", count: 8 },
            ],
            acceptedRate: 25, // (5/20)*100
            });
        });
        });
