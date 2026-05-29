import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request } from "express";

export const registerUser = async (
  req: Request,
  name: string,
  email: string,
  password: string,
) => {
  const exitingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exitingUser) {
    req.log.error("User  already exists");
    throw new Error("User  already exists");
  }
  const { password: _, ...safeUser } = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 3),
    },
  });

  return safeUser;
};

export const loginUser = async (
  req: Request,
  email: string,
  password: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    req.log.error("User not found");
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.log.error("invalid password");
    throw new Error("invalid password");
  }
  const payload = {
    userId: user.id,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return token;
};
