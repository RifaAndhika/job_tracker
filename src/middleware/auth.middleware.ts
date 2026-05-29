import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/auth";
import { success } from "zod";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.log.warn(
      {
        reason: "jwt malformed",
      },
      "token verification failed",
    );
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    req.log.warn("Authorization header format invalid");
    return res
      .status(401)
      .json({ success: false, message: "Authorization header format invalid" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    req.log.warn("Token not provided");
    return res
      .status(401)
      .json({ success: false, message: "token not provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.user = decoded;

    if (req.log) {
      req.log = req.log.child({ userId: decoded.userId });
    }

    next();
  } catch {
    req.log.warn("Token verification failed");
    return res
      .status(401)
      .json({ success: false, message: "Token verification failed" });
  }
};
