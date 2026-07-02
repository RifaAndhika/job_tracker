import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { logger } from "../libs/logger";

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.statusCode === 429) {
    res.status(429).json({
      success: false,
      message: err.message,
    });
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  logger.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
