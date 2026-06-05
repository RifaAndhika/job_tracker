"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardOverviewService = exports.getAcceptedRateService = exports.totalApplicationsMonthlyService = exports.totalApplicationsByStatusService = exports.totalApplicationsService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const totalApplicationsService = async (userid) => {
    const total = await prisma_1.default.jobApplication.count({
        where: {
            userId: userid,
        },
    });
    return total;
};
exports.totalApplicationsService = totalApplicationsService;
const totalApplicationsByStatusService = async (userid) => {
    const grouped = await prisma_1.default.jobApplication.groupBy({
        by: ["status"],
        where: {
            userId: userid,
        },
        _count: {
            status: true,
        },
    });
    const analytics = {
        total: 0,
        APPLIED: 0,
        SCREENING: 0,
        INTERVIEW: 0,
        OFFER: 0,
        REJECTED: 0,
        ACCEPTED: 0,
    };
    grouped.forEach((item) => {
        analytics.total += item._count.status;
        switch (item.status) {
            case "APPLIED":
                analytics.APPLIED = item._count.status;
                break;
            case "ACCEPTED":
                analytics.ACCEPTED = item._count.status;
                break;
            case "REJECTED":
                analytics.REJECTED = item._count.status;
                break;
            case "OFFER":
                analytics.OFFER = item._count.status;
                break;
            case "INTERVIEW":
                analytics.INTERVIEW = item._count.status;
                break;
            case "SCREENING":
                analytics.SCREENING = item._count.status;
                break;
        }
    });
    return analytics;
};
exports.totalApplicationsByStatusService = totalApplicationsByStatusService;
const totalApplicationsMonthlyService = async (userid) => {
    const grouped = await prisma_1.default.$queryRaw `
  SELECT
  TO_CHAR( DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month,
  COUNT(*):: int AS count
  FROM "JobApplication"
  WHERE "userId" = ${userid}
  GROUP BY month
  ORDER BY month ASC
  `;
    return grouped.map((item) => ({
        month: item.month,
        count: Number(item.count),
    }));
    return grouped;
};
exports.totalApplicationsMonthlyService = totalApplicationsMonthlyService;
const getAcceptedRateService = async (userId) => {
    const total = await prisma_1.default.jobApplication.count({
        where: {
            userId: userId,
        },
    });
    const accepted = await prisma_1.default.jobApplication.count({
        where: {
            status: "ACCEPTED",
            userId: userId,
        },
    });
    if (total === 0)
        return 0;
    return Math.round((accepted / total) * 100);
};
exports.getAcceptedRateService = getAcceptedRateService;
const getDashboardOverviewService = async (userId) => {
    const [totalApplications, statusStats, monthlyStats, acceptedRate] = await Promise.all([
        (0, exports.totalApplicationsService)(userId),
        (0, exports.totalApplicationsByStatusService)(userId),
        (0, exports.totalApplicationsMonthlyService)(userId),
        (0, exports.getAcceptedRateService)(userId),
    ]);
    return {
        totalApplications,
        statusStats,
        monthlyStats,
        acceptedRate,
    };
};
exports.getDashboardOverviewService = getDashboardOverviewService;
//# sourceMappingURL=dashboard.service.js.map