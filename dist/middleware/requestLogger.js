"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const pino_http_1 = __importDefault(require("pino-http"));
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("../libs/logger");
exports.requestLogger = (0, pino_http_1.default)({
    logger: logger_1.logger,
    level: "info",
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err) {
            return "error";
        }
        if (res.statusCode >= 400) {
            return "warn";
        }
        return "info";
    },
    customProps: (req) => {
        const request = req;
        return {
            userId: request.user?.userId,
        };
    },
    genReqId: () => {
        return crypto_1.default.randomUUID();
    },
    serializers: {
        req: (req) => {
            return {
                id: req.id,
                method: req.method,
                url: req.url,
            };
        },
        res: (res) => {
            return {
                statusCode: res.statusCode,
            };
        },
    },
    customSuccessMessage: () => {
        return "request completed";
    },
    customErrorMessage: () => {
        return "request failed";
    },
});
//# sourceMappingURL=requestLogger.js.map