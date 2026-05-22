import { Request, Response } from "express";
import {
  totalApplicationsByStatusService,
  totalApplicationsMonthlyService,
  totalApplicationsService,
  getAcceptedRateService,
  getDashboardOverviewService,
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

export const acceptedRateHandler = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const totalJobs = await getAcceptedRateService(userId);
  sendResponse({
    res,
    success: true,
    data: totalJobs,
  });
};

export const getDashboardHandler = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const totalJobs = await getDashboardOverviewService(userId);
  sendResponse({
    res,
    success: true,
    data: totalJobs,
  });
};
