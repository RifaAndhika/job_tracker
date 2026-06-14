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