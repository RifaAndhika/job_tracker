"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryJob = void 0;
const validateQueryJob = (schema) => (req, res, next) => {
    const validatedQuery = schema.parse(req.query);
    req.validatedQuery = validatedQuery;
    next();
};
exports.validateQueryJob = validateQueryJob;
//# sourceMappingURL=job.validation.js.map