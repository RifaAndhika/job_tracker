import { z } from "zod";

export const createJobSchema = z.object({
  companyName: z.string().min(1),

  position: z.string().min(1),

  status: z.enum([
    "APPLIED",
    "SCREENING",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
    "ACCEPTED",
  ]),

  appliedDate: z.coerce.date(),

  source: z.string().optional(),

  notes: z.string().optional(),
});
export type CreateJobInput = z.infer<typeof createJobSchema>;

export type JobQueryType = z.infer<typeof jobQuerySchema>;

export const jobQuerySchema = z.object({
  id: z.string().min(1).optional(),
  status: z
    .enum([
      "APPLIED",
      "SCREENING",
      "INTERVIEW",
      "OFFER",
      "REJECTED",
      "ACCEPTED",
    ])
    .optional(),

  search: z.string().optional(),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(50).default(10),
});
