import { Router } from "express";
import { authenticatedLimiter } from "../../middleware/rateLimiter";
import {
  createJobHandler,
  getJobsHandler,
  getJobByIdHandler,
  updateJobHandler,
  deleteJobHandler,
} from "./job.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  validate,
  validateQueryJob,
} from "../../middleware/validation.middleware";
import { createJobSchema } from "./job.schema";
import { jobQuerySchema } from "./job.schema";

const router = Router();

router.use(authMiddleware);

router.post("/create", validate(createJobSchema), createJobHandler);
router.get(
  "/get",
  authenticatedLimiter,
  validateQueryJob(jobQuerySchema),
  getJobsHandler,
);
router.get("/:id", authenticatedLimiter, getJobByIdHandler);
router.put("/:id", validate(createJobSchema), updateJobHandler);
router.delete("/:id", deleteJobHandler);
export default router;

// {
//   "companyName": "Google",
//   "position": "Backend Engineer",
//   "status": "APPLIED",
//   "appliedDate": "2026-05-08T00:00:00.000Z",
//   "notes": "Waiting response"
// }
