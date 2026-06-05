"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobQuerySchema = exports.createJobSchema = void 0;
const zod_1 = require("zod");
exports.createJobSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1),
    position: zod_1.z.string().min(1),
    status: zod_1.z.enum([
        "APPLIED",
        "SCREENING",
        "INTERVIEW",
        "OFFER",
        "REJECTED",
        "ACCEPTED",
    ]),
    appliedDate: zod_1.z.coerce.date(),
    source: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.jobQuerySchema = zod_1.z.object({
    status: zod_1.z
        .enum([
        "APPLIED",
        "SCREENING",
        "INTERVIEW",
        "OFFER",
        "REJECTED",
        "ACCEPTED",
    ])
        .optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(50).default(10),
    sort: zod_1.z.enum(["asc", "desc"]).default("desc"),
    sortBy: zod_1.z.enum(["appliedDate"]).default("appliedDate"),
});
//# sourceMappingURL=job.schema.js.map