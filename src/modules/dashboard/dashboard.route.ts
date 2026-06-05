import { Router } from "express";
import {
  totalApplicationsHandler,
  totalApplicationsByStatusHandler,
  totalApplicationMonthlyHandler,
  acceptedRateHandler,
  getDashboardHandler,
} from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

router.get("/analytics", totalApplicationsHandler);
router.get("/analytics/by-status", totalApplicationsByStatusHandler);
router.get("/analytics/monthly", totalApplicationMonthlyHandler);
router.get("/analytics/accepted-rate", acceptedRateHandler);
router.get("/analytics/overview", getDashboardHandler);

export default router;
