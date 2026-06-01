import { Request, Response } from "express";
import { registerUser, loginUser, logoutUser } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../utils/jwtUtils";
import { AuthPayload } from "../../types/auth";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const user = await registerUser(name, email, password);
    req.log.info({ userId: user.id }, "User registered");

    sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err: any) {
    req.log.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { accessToken, refreshToken } = await loginUser(email, password);

    const decoded = verifyAccessToken(accessToken);
    req.log.info({ userId: decoded.userId }, "User logged in");

    sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "User logged in successfully",
      data: { accessToken, refreshToken },
    });
  } catch (err: any) {
    req.log.error(err.message);
    res.status(401).json({ message: err.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken) as AuthPayload;
    const newAccessToken = generateAccessToken({
      id: payload.userId,
      email: payload.email || "",
    });
    req.log.info({ userId: payload.userId }, "Access token refreshed");
    sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Access token refreshed successfully",
      data: { accessToken: newAccessToken },
    });
  } catch (err: any) {
    req.log.error(err.message);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Missing token" });
    }
    await logoutUser(req.user.userId);
    req.log.info("User logged out");
    sendResponse({
      res,
      statusCode: 200,
      success: true,
      data: null,
      message: "User logged out successfully",
    });
  } catch (err: any) {
    req.log.error(err.message);
    res.status(500).json({ message: err.message });
  }
};
