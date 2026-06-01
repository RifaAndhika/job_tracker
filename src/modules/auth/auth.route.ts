import express from "express";
import { register, login, refresh, logout } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", authMiddleware, logout);

export default router;
