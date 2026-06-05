"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJobService = exports.updateJobService = exports.getJobByIdService = exports.getJobService = exports.createJobService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const createJobService = async (userId, data) => {
    return prisma_1.default.jobApplication.create({
        data: {
            userId,
            companyName: data.companyName,
            position: data.position,
            status: data.status,
            appliedDate: new Date(data.appliedDate),
            ...(data.source !== undefined && { source: data.source }),
            ...(data.notes !== undefined && { notes: data.notes }),
        },
    });
};
exports.createJobService = createJobService;
const getJobService = async (userId, query) => {
    const { status, search, page, limit, sort, sortBy } = query;
    const skip = (page - 1) * limit;
    const jobs = await prisma_1.default.jobApplication.findMany({
        where: {
            userId,
            ...(status && { status }),
            ...(search && {
                OR: [
                    { companyName: { contains: search, mode: "insensitive" } },
                    { position: { contains: search, mode: "insensitive" } },
                ],
            }),
        },
        orderBy: {
            [sortBy]: sort,
        },
        skip,
        take: limit,
    });
    const total = await prisma_1.default.jobApplication.count({
        where: {
            userId,
            ...(status && { status }),
            ...(search && {
                OR: [
                    { companyName: { contains: search, mode: "insensitive" } },
                    { position: { contains: search, mode: "insensitive" } },
                ],
            }),
        },
    });
    const totalPages = Math.ceil(total / limit);
    return {
        data: jobs,
        meta: {
            total,
            page,
            limit,
            totalPages,
        },
    };
};
exports.getJobService = getJobService;
const getJobByIdService = async (jobId, userId) => {
    return prisma_1.default.jobApplication.findFirst({
        where: {
            id: jobId,
            userId: userId,
        },
    });
};
exports.getJobByIdService = getJobByIdService;
const updateJobService = async (userId, jobId, data) => {
    return prisma_1.default.jobApplication.updateMany({
        where: {
            id: jobId,
            userId: userId,
        },
        data,
    });
};
exports.updateJobService = updateJobService;
const deleteJobService = async (userId, jobId) => {
    return prisma_1.default.jobApplication.deleteMany({
        where: {
            id: jobId,
            userId: userId,
        },
    });
};
exports.deleteJobService = deleteJobService;
//# sourceMappingURL=job.service.js.map