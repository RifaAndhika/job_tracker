import pinoHttp from "pino-http";
import { Request, Response } from "express";
import crypto from "crypto";

import { logger } from "../libs/logger";

export const requestLogger = pinoHttp({
  logger: logger,

  customProps: (req) => {
    const request = req as Request;
    return {
      userId: request.user?.userId,
    };
  },
  genReqId: () => {
    return crypto.randomUUID();
  },

  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
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
