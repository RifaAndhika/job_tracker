"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
}
function generateRefreshToken(user) {
    return jsonwebtoken_1.default.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET);
}
//# sourceMappingURL=jwtUtils.js.map