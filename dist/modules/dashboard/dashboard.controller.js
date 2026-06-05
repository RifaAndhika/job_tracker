"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardHandler = exports.acceptedRateHandler = exports.totalApplicationMonthlyHandler = exports.totalApplicationsByStatusHandler = exports.totalApplicationsHandler = void 0;
const dashboard_service_1 = require("./dashboard.service");
const sendResponse_1 = require("../../utils/sendResponse");
const totalApplicationsHandler = async (req, res) => {
    const userId = req.user.userId;
    const totalJobs = await (0, dashboard_service_1.totalApplicationsService)(userId);
    req.log.info("Total applications fetched");
    (0, sendResponse_1.sendResponse)({
        res,
        success: true,
        data: totalJobs,
    });
};
exports.totalApplicationsHandler = totalApplicationsHandler;
const totalApplicationsByStatusHandler = async (req, res) => {
    const userId = req.user.userId;
    const totalJobs = await (0, dashboard_service_1.totalApplicationsByStatusService)(userId);
    req.log.info("Total applications by status fetched");
    (0, sendResponse_1.sendResponse)({
        res,
        success: true,
        data: totalJobs,
    });
};
exports.totalApplicationsByStatusHandler = totalApplicationsByStatusHandler;
const totalApplicationMonthlyHandler = async (req, res) => {
    const userId = req.user.userId;
    const totalJobs = await (0, dashboard_service_1.totalApplicationsMonthlyService)(userId);
    req.log.info("Total applications by month fetched");
    (0, sendResponse_1.sendResponse)({
        res,
        success: true,
        data: totalJobs,
    });
};
exports.totalApplicationMonthlyHandler = totalApplicationMonthlyHandler;
const acceptedRateHandler = async (req, res) => {
    const userId = req.user.userId;
    const totalJobs = await (0, dashboard_service_1.getAcceptedRateService)(userId);
    req.log.info("Accepted rate fetched");
    (0, sendResponse_1.sendResponse)({
        res,
        success: true,
        data: totalJobs,
    });
};
exports.acceptedRateHandler = acceptedRateHandler;
const getDashboardHandler = async (req, res) => {
    const userId = req.user.userId;
    const totalJobs = await (0, dashboard_service_1.getDashboardOverviewService)(userId);
    req.log.info("Dashboard overview fetched");
    (0, sendResponse_1.sendResponse)({
        res,
        success: true,
        data: totalJobs,
    });
};
exports.getDashboardHandler = getDashboardHandler;
//# sourceMappingURL=dashboard.controller.js.map