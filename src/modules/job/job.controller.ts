import { Response } from "express";
import {
  createJobService,
  getJobService,
  getJobByIdService,
  updateJobService,
  deleteJobService,
} from "./job.service";

export const createJobHandler = async (req: any, res: Response) => {
  const userId = req.user.userId;
  const job = await createJobService(userId, req.body);
  res.status(201).json(job);
};

export const getJobsHandler = async (req: any, res: Response) => {
  const userId = req.user.userId;
  const jobs = await getJobService(userId);
  res.json(jobs);
};

export const getJobByIdHandler = async (req: any, res: Response) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const job = await getJobByIdService(jobId, userId);
  res.json(job);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
};

export const updateJobHandler = async (req: any, res: Response) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const job = await updateJobService(userId, jobId, req.body);
  res.json(job);
};

export const deleteJobHandler = async (req: any, res: Response) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const job = await deleteJobService(userId, jobId);
  res.json(job);
};
