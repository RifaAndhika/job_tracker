import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { generateAccessToken, verifyAccessToken } from "../../utils/jwtUtils";
import { AppError } from "../../utils/appError";
import { AuthPayload } from "../../types/auth";
import { th } from "zod/locales";

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
  const { Refreshtoken } = req.body;
  if (!Refreshtoken) {
    throw new AppError("Refresh token is required", 400);
  }

  try {
    const { accessToken } = await refreshToken(Refreshtoken);
    req.log.info({ Refreshtoken }, "Access token refreshed");
    sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Access token refreshed successfully",
      data: { accessToken },
    });
  } catch (err: any) {
    req.log.error(err.message);
    throw new AppError("Refresh token failed", 500);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
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
    if (err instanceof AppError) {
      req.log.error(err.message);
      throw new AppError("logout failed", 500);
    }
  }
};
