import { Router } from "express";
import { authenticatedLimiter } from "../../middleware/rateLimiter";
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

router.get("/analytics", authenticatedLimiter, totalApplicationsHandler);
router.get(
  "/analytics/by-status",
  authenticatedLimiter,
  totalApplicationsByStatusHandler,
);
router.get(
  "/analytics/monthly",
  authenticatedLimiter,
  totalApplicationMonthlyHandler,
);
router.get(
  "/analytics/accepted-rate",
  authenticatedLimiter,
  acceptedRateHandler,
);
router.get("/analytics/overview", authenticatedLimiter, getDashboardHandler);

export default router;
