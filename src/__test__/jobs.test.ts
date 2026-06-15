import supertest from 'supertest';
import app from '../app';
import {prismaMock} from './helpers/prismaMock';
import {generateAccessToken} from '../utils/jwtUtils';

const request = supertest(app);



describe("GET /api/jobs/get", () => {
    it("should return a list of jobs for the authenticated user", async () => {
        
        const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });
        prismaMock.jobApplication.findMany.mockResolvedValue([{
            id: "job-123",
            userId: "user-123",
            companyName: "PT Maju",
            position: "Backend Developer",
            status: "APPLIED",
            appliedDate: new Date(),
            source: null,
            notes: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }]);

        const res = await request
            .get("/api/jobs/get")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

})

describe("POST /api/jobs/create", () => {
    it("should create a new job application for the authenticated user", async () => {
        const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });
    
        prismaMock.jobApplication.create.mockResolvedValue({
            id: "job-123",
            userId: "user-123",
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
            .post("/api/jobs/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                companyName: "PT Maju",
                position: "Backend Developer",
                status: "APPLIED",
                appliedDate: new Date().toISOString(),
            });
        
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data.companyName).toBe("PT Maju");
            expect(res.body.data.position).toBe("Backend Developer");
            expect(res.body.data.status).toBe("APPLIED");
    });
});

describe("GET /api/jobs/:id", () => {
    it("should return a job application by ID for the authenticated user", async () => {
        const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });
    
        prismaMock.jobApplication.findFirst.mockResolvedValue({
            id: "job-123",
            userId: "user-123",
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
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.companyName).toBe("PT Maju");
        expect(res.body.data.position).toBe("Backend Developer");
        expect(res.body.data.status).toBe("APPLIED");
    });
});

describe("PUT /api/jobs/:id", () => {
    it("should update a job application by ID for the authenticated user", async () => {
        const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });
    
        prismaMock.jobApplication.update.mockResolvedValue({
            id: "job-123",
            userId: "user-123",
            companyName: "PT Maju",
            position: "Backend Developer",
            status: "INTERVIEW",
            appliedDate: new Date(),
            source: null,
            notes: null,
            createdAt: new Date(),
            updatedAt: new Date(),
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
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.companyName).toBe("PT Maju");
        expect(res.body.data.position).toBe("Backend Developer");
        expect(res.body.data.status).toBe("INTERVIEW");
    });
});


describe("DELETE /api/jobs/:id", () => {
    it("deleted job application", async () => {
        const token = generateAccessToken({ id: "4101880a-ba2a-47e2-9ff7-8961686c6f00", email: "user@example.com" });

        prismaMock.jobApplication.delete.mockResolvedValue({
             id: "job-123",
            userId: "user-123",
            companyName: "PT Maju",
            position: "Backend Developer",
            status: "INTERVIEW",
            appliedDate: new Date(),
            source: null,
            notes: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const res = await request
            .delete("/api/jobs/job-123")
            .set("Authorization", `Bearer ${token}`)
            .send({
                companyName: "PT Maju",
                position: "Backend Developer",
                status: "INTERVIEW",
                appliedDate: new Date().toISOString(),
            
            });

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data.companyName).toBe("PT Maju");
            expect(res.body.data.position).toBe("Backend Developer");
            expect(res.body.data.status).toBe("INTERVIEW");
    });
});