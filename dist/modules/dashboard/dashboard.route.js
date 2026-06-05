"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get("/analytics", dashboard_controller_1.totalApplicationsHandler);
router.get("/analytics/by-status", dashboard_controller_1.totalApplicationsByStatusHandler);
router.get("/analytics/monthly", dashboard_controller_1.totalApplicationMonthlyHandler);
router.get("/analytics/accepted-rate", dashboard_controller_1.acceptedRateHandler);
router.get("/analytics/overview", dashboard_controller_1.getDashboardHandler);
exports.default = router;
//# sourceMappingURL=dashboard.route.js.map