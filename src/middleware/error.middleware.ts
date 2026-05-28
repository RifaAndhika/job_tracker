import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.log.error(err);

  return res.status(500).json({
    error: err.message,
  });
};
