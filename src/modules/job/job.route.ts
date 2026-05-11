import { Router } from "express";
import {
  createJobHandler,
  getJobsHandler,
  getJobByIdHandler,
} from "./job.controller";
import { authMiddlerware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddlerware);

router.post("/create", createJobHandler);
router.get("/get", getJobsHandler);
router.get("/:id", getJobByIdHandler);

export default router;
