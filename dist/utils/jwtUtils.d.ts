import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/auth";
export declare function generateAccessToken(user: {
    id: string;
    email: string;
}): string;
export declare function generateRefreshToken(user: {
    id: string;
}): string;
export declare function verifyAccessToken(token: string): AuthPayload;
export declare function verifyRefreshToken(token: string): string | jwt.JwtPayload;
//# sourceMappingURL=jwtUtils.d.ts.map