import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../types/auth";
import { verifyAccessToken } from "../utils/jwtUtils";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.log.warn({ reason: "jwt malformed" }, "token verification failed");
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
      .json({ success: false, message: "Token not provided" });
  }

  try {
    const decoded = verifyAccessToken(token) as AuthPayload;
    req.user = decoded;
    req.log = req.log.child({ userId: decoded.userId });
    next();
  } catch (err: any) {
    req.log.error("Token verification failed");
    // ganti ke 401, bukan 403
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
