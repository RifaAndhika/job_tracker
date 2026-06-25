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
  req.log.info("Total applications fetched");
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
  try {
    const totalJobs = await totalApplicationsByStatusService(userId);
    req.log.info("Total applications by status fetched");
    sendResponse({
      res,
      success: true,
      data: totalJobs,
    });
  } catch (err) {
    req.log.error(err);
    sendResponse({
      res,
      success: true,
      message: "failed to fetch analytics",
      data: null,
    });
  }
};

export const totalApplicationMonthlyHandler = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user.userId;
  const totalJobs = await totalApplicationsMonthlyService(userId);
  req.log.info("Total applications by month fetched");
  sendResponse({
    res,
    success: true,
    data: totalJobs,
  });
};

export const acceptedRateHandler = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const totalJobs = await getAcceptedRateService(userId);
  req.log.info("Accepted rate fetched");
  sendResponse({
    res,
    success: true,
    data: totalJobs,
  });
};

export const getDashboardHandler = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const totalJobs = await getDashboardOverviewService(userId);
  req.log.info("Dashboard overview fetched");
  sendResponse({
    res,
    success: true,
    data: totalJobs,
  });
};
