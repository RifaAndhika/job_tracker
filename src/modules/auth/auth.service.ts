import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (
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
    throw new Error("User  already exists");
  }

  return await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 3),
    },
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return token;
};
