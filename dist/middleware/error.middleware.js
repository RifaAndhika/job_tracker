"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
    req.log.error(err.message);
    res
        .status(err.statusCode || 500)
        .json({ success: false, message: err.message || "Internal Server Error" });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map