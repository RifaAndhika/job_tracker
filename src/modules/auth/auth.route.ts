import express from "express";
import { authLimiter } from "../../middleware/rateLimiter";
import {
  register,
  login,
  refreshTokenController,
  logout,
} from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refreshTokenController);
router.post("/logout", authMiddleware, logout);

export default router;
