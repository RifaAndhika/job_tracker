"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const sendResponse_1 = require("../../utils/sendResponse");
const jwtUtils_1 = require("../../utils/jwtUtils");
const appError_1 = require("../../utils/appError");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await (0, auth_service_1.registerUser)(name, email, password);
        req.log.info({ userId: user.id }, "User registered");
        (0, sendResponse_1.sendResponse)({
            res,
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: user,
        });
    }
    catch (err) {
        req.log.error(err.message);
        res.status(400).json({ message: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { accessToken, refreshToken } = await (0, auth_service_1.loginUser)(email, password);
        const decoded = (0, jwtUtils_1.verifyAccessToken)(accessToken);
        req.log.info({ userId: decoded.userId }, "User logged in");
        (0, sendResponse_1.sendResponse)({
            res,
            statusCode: 200,
            success: true,
            message: "User logged in successfully",
            data: { accessToken, refreshToken },
        });
    }
    catch (err) {
        req.log.error(err.message);
        res.status(401).json({ message: err.message });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new appError_1.AppError("Refresh token is required", 400);
    }
    try {
        const payload = (0, jwtUtils_1.verifyRefreshToken)(refreshToken);
        const newAccessToken = (0, jwtUtils_1.generateAccessToken)({
            id: payload.userId,
            email: payload.email || "",
        });
        req.log.info({ userId: payload.userId }, "Access token refreshed");
        (0, sendResponse_1.sendResponse)({
            res,
            statusCode: 200,
            success: true,
            message: "Access token refreshed successfully",
            data: { accessToken: newAccessToken },
        });
    }
    catch (err) {
        req.log.error(err.message);
        throw new appError_1.AppError("Refresh token is required", 400);
    }
};
exports.refresh = refresh;
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new appError_1.AppError("Refresh token is required", 400);
        }
        await (0, auth_service_1.logoutUser)(req.user.userId);
        req.log.info("User logged out");
        (0, sendResponse_1.sendResponse)({
            res,
            statusCode: 200,
            success: true,
            data: null,
            message: "User logged out successfully",
        });
    }
    catch (err) {
        req.log.error(err.message);
        throw new appError_1.AppError("Logout failed", 500);
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map