"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("./job.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const job_validation_1 = require("../job/job.validation");
const job_schema_1 = require("./job.schema");
const job_schema_2 = require("./job.schema");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post("/create", (0, validation_middleware_1.validate)(job_schema_1.createJobSchema), job_controller_1.createJobHandler);
router.get("/get", (0, job_validation_1.validateQueryJob)(job_schema_2.jobQuerySchema), job_controller_1.getJobsHandler);
router.get("/:id", job_controller_1.getJobByIdHandler);
router.put("/:id", (0, validation_middleware_1.validate)(job_schema_1.createJobSchema), job_controller_1.updateJobHandler);
router.delete("/:id", job_controller_1.deleteJobHandler);
exports.default = router;
// {
//   "companyName": "Google",
//   "position": "Backend Engineer",
//   "status": "APPLIED",
//   "appliedDate": "2026-05-08T00:00:00.000Z",
//   "notes": "Waiting response"
// }
//# sourceMappingURL=job.route.js.map