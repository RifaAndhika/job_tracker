import { refreshTokenController } from "./auth.controller";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwtUtils";
import { AuthPayload } from "../../types/auth";
import { AppError } from "../../utils/appError";

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const { password: _, ...safeUser } = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return safeUser; // ✅ return data, bukan res.json
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("User not found", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  return { accessToken, refreshToken }; // ✅ return objek token
}

export async function refreshTokenService(refreshToken: string) {
  const record = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });
  if (!record) throw new AppError("Refresh token is required", 401);

  const payload = verifyRefreshToken(refreshToken) as AuthPayload;
  const accessToken = generateAccessToken({
    id: payload.userId,
    email: payload.email || "",
  });
  return { accessToken };
}

//oke ini jadi problem jika akun akses di dua device sama waktu maka akan kickout device lain juga
export async function logoutUser(userId: string) {
  await prisma.refreshToken.deleteMany({ where: { userId } });
}
