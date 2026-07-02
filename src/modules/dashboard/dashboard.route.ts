import { Router } from "express";
import { heavyLimiter } from "../../middleware/rateLimiter";
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

router.get("/analytics", heavyLimiter, totalApplicationsHandler);
router.get(
  "/analytics/by-status",
  heavyLimiter,
  totalApplicationsByStatusHandler,
);
router.get("/analytics/monthly", heavyLimiter, totalApplicationMonthlyHandler);
router.get("/analytics/accepted-rate", heavyLimiter, acceptedRateHandler);
router.get("/analytics/overview", heavyLimiter, getDashboardHandler);

export default router;
