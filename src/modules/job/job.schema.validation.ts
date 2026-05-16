import { z } from "zod";

export const createJobSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),

  position: z.string().min(1, "Position is required"),

  status: z.enum([
    "APPLIED",
    "SCREENING",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
    "ACCEPTED",
  ]),

  appliedDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export const jobQuerySchema = z.object({
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
