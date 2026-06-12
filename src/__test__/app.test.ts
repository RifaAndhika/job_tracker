import supertest from "supertest"
import app from "../app"

const request = supertest(app)

describe("GET /", () =>  {
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
    })
})