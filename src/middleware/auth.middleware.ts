import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AuthPayload } from "../types/auth";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error("token not found");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

    req.user = decoded;

    req.log = req.log.child({ userId: decoded.userId });

    next();
  } catch {
    throw new Error("token expired");
  }
};
