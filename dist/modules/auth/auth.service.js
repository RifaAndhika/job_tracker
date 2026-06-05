"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtUtils_1 = require("../../utils/jwtUtils");
const appError_1 = require("../../utils/appError");
async function registerUser(name, email, password) {
    const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existingUser)
        throw new Error("User already exists");
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const { password: _, ...safeUser } = await prisma_1.prisma.user.create({
        data: { name, email, password: hashedPassword },
    });
    return safeUser; // ✅ return data, bukan res.json
}
async function loginUser(email, password) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new appError_1.AppError("User not found", 400);
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        throw new appError_1.AppError("Invalid password", 400);
    const accessToken = (0, jwtUtils_1.generateAccessToken)(user);
    const refreshToken = (0, jwtUtils_1.generateRefreshToken)(user);
    await prisma_1.prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
    });
    return { accessToken, refreshToken }; // ✅ return objek token
}
async function logoutUser(userId) {
    await prisma_1.prisma.refreshToken.deleteMany({ where: { userId } });
}
//# sourceMappingURL=auth.service.js.map