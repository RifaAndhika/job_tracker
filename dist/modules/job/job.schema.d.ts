import { z } from "zod";
export declare const createJobSchema: z.ZodObject<{
    companyName: z.ZodString;
    position: z.ZodString;
    status: z.ZodEnum<{
        APPLIED: "APPLIED";
        SCREENING: "SCREENING";
        INTERVIEW: "INTERVIEW";
        OFFER: "OFFER";
        REJECTED: "REJECTED";
        ACCEPTED: "ACCEPTED";
    }>;
    appliedDate: z.ZodCoercedDate<unknown>;
    source: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type JobQueryType = z.infer<typeof jobQuerySchema>;
export declare const jobQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        APPLIED: "APPLIED";
        SCREENING: "SCREENING";
        INTERVIEW: "INTERVIEW";
        OFFER: "OFFER";
        REJECTED: "REJECTED";
        ACCEPTED: "ACCEPTED";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        appliedDate: "appliedDate";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=job.schema.d.ts.map