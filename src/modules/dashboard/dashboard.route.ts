import { Router } from "express";
import {
  totalApplicationsHandler,
  totalApplicationsByStatusHandler,
  totalApplicationMonthlyHandler,
} from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

router.get("/analytics", totalApplicationsHandler);
router.get("/analytics/by-status", totalApplicationsByStatusHandler);
router.get("/analytics/monthly", totalApplicationMonthlyHandler);

export default router;
