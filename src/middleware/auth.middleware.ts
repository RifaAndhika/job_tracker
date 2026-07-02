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

  const parts = authHeader.split(" ");
  if (parts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ success: false, message: "Authorization header format invalid" });
  }
  if (!parts[1]) {
    return res
      .status(401)
      .json({ success: false, message: "Token not provided" });
  }

  try {
    const decoded = verifyAccessToken(parts[1]) as AuthPayload;
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
