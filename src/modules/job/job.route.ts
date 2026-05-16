import { Router } from "express";
import {
  createJobHandler,
  getJobsHandler,
  getJobByIdHandler,
  updateJobHandler,
  deleteJobHandler,
} from "./job.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { validateQueryJob } from "./job.validation";
import { createJobSchema } from "./job.schema.validation";
import { jobQuerySchema } from "./job.schema.validation";

const router = Router();

router.use(authMiddleware);

router.post("/create", createJobHandler, validate(createJobSchema));
router.get("/get", validateQueryJob(jobQuerySchema), getJobsHandler);
router.get("/:id", getJobByIdHandler);
router.put("/:id", updateJobHandler, validate(createJobSchema));
router.delete("/:id", deleteJobHandler);
export default router;

// {
//   "companyName": "Google",
//   "position": "Backend Engineer",
//   "status": "APPLIED",
//   "appliedDate": "2026-05-08T00:00:00.000Z",
//   "notes": "Waiting response"
// }
