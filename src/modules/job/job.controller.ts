import { Response, Request } from "express";
import {
  createJobService,
  getJobService,
  getJobByIdService,
  updateJobService,
  deleteJobService,
} from "./job.service";

import { sendResponse } from "../../utils/sendResponse";

export const createJobHandler = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const job = await createJobService(userId, req.body);
  sendResponse({
    res,
    statusCode: 201,
    success: true,
    data: job,
    message: "Job created successfully",
  });
};

export const getJobsHandler = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const jobs = await getJobService(userId, req.validatedQuery);
  sendResponse({
    res,
    success: true,
    data: jobs.data,
    meta: jobs.meta,
  });
};

export const getJobByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const job = await getJobByIdService(jobId, userId);
  sendResponse({
    res,
    success: true,
    data: job,
  });
};

export const updateJobHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const job = await updateJobService(userId, jobId, req.body);
  sendResponse({
    res,
    success: true,
    data: job,
  });
};

export const deleteJobHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const job = await deleteJobService(userId, jobId);
  sendResponse({
    res,
    success: true,
    data: job,
  });
};
