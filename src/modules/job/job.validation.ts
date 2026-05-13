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
