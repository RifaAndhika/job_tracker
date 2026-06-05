"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJobHandler = exports.updateJobHandler = exports.getJobByIdHandler = exports.getJobsHandler = exports.createJobHandler = void 0;
const job_service_1 = require("./job.service");
const sendResponse_1 = require("../../utils/sendResponse");
const createJobHandler = async (req, res) => {
    const userId = req.user.userId;
    req.log.info({ userid: userId }, "Job created");
    const job = await (0, job_service_1.createJobService)(userId, req.body);
    (0, sendResponse_1.sendResponse)({
        res,
        statusCode: 201,
        success: true,
        data: job,
        message: "Job created successfully",
    });
    req.log.info("Job created successfully");
};
exports.createJobHandler = createJobHandler;
const getJobsHandler = async (req, res) => {
    const userId = req.user.userId;
    const jobs = await (0, job_service_1.getJobService)(userId, req.validatedQuery);
    req.log.info({ userid: userId }, "Jobs fetched");
    (0, sendResponse_1.sendResponse)({
        res,
        success: true,
        data: jobs.data,
        meta: jobs.meta,
    });
};
exports.getJobsHandler = getJobsHandler;
const getJobByIdHandler = async (req, res) => {
    const userId = req.user.userId;
    const jobId = req.params.id;
    const job = await (0, job_service_1.getJobByIdService)(jobId, userId);
    req.log.info("Job fetched by id");
    (0, sendResponse_1.sendResponse)({
        res,
        success: true,
        data: job,
    });
};
exports.getJobByIdHandler = getJobByIdHandler;
const updateJobHandler = async (req, res) => {
    const userId = req.user.userId;
    const jobId = req.params.id;
    const job = await (0, job_service_1.updateJobService)(userId, jobId, req.body);
    req.log.info("Job updated");
    (0, sendResponse_1.sendResponse)({
        res,
        success: true,
        data: job,
    });
};
exports.updateJobHandler = updateJobHandler;
const deleteJobHandler = async (req, res) => {
    const userId = req.user.userId;
    const jobId = req.params.id;
    const job = await (0, job_service_1.deleteJobService)(userId, jobId);
    req.log.info("Job deleted");
    (0, sendResponse_1.sendResponse)({
        res,
        success: true,
        data: job,
    });
};
exports.deleteJobHandler = deleteJobHandler;
//# sourceMappingURL=job.controller.js.map