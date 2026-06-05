"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = ({ res, statusCode, success, data, message, meta, }) => {
    res.status(statusCode || 200).json({
        success,
        message,
        data,
        meta,
    });
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map