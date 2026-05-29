import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../../types/auth";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await registerUser(req, name, email, password);
  req.log.info(
    {
      userId: user.id,
    },
    "User registered",
  );
  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await loginUser(req, email, password);
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
  req.log.info({ userId: decoded.userId }, "User logged in");
  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: { token },
  });
};
