import { Response, Request } from "express";
import {
  createJobService,
  getJobService,
  getJobByIdService,
  updateJobService,
  deleteJobService,
} from "./job.service";
import { AppError } from "../../utils/appError";
import { sendResponse } from "../../utils/sendResponse";

export const createJobHandler = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  req.log.info({ userid: userId }, "Job created");
  const job = await createJobService(userId, req.body);
  sendResponse({
    res,
    statusCode: 201,
    success: true,
    data: job,
    message: "Job created successfully",
  });
  req.log.info("Job created successfully");
};

export const getJobsHandler = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const jobs = await getJobService(userId, req.validatedQuery);
  req.log.info({ userid: userId }, "Jobs fetched");
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
  req.log.info("Job fetched by id");
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
  req.log.info("Job updated");
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
  req.log.info("Job deleted");
  sendResponse({
    res,
    success: true,
    data: job,
  });
};
