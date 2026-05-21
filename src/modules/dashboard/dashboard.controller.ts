import { Request, Response } from "express";
import {
  totalApplicationsByStatusService,
  totalApplicationsMonthlyService,
  totalApplicationsService,
} from "./dashboard.service";
import { sendResponse } from "../../utils/sendResponse";

export const totalApplicationsHandler = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const totalJobs = await totalApplicationsService(userId);
  sendResponse({
    res,
    success: true,
    data: totalJobs,
  });
};

export const totalApplicationsByStatusHandler = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user.userId;
  const totalJobs = await totalApplicationsByStatusService(userId);
  sendResponse({
    res,
    success: true,
    data: totalJobs,
  });
};

export const totalApplicationMonthlyHandler = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user.userId;
  const totalJobs = await totalApplicationsMonthlyService(userId);
  sendResponse({
    res,
    success: true,
    data: totalJobs,
  });
};
