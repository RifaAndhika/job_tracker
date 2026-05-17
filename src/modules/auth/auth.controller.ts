import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await registerUser(name, email, password);
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
  const token = await loginUser(email, password);
  sendResponse({
    res,
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: { token },
  });
};
