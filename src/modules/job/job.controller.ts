import { Request, Response } from "express";
import { createJob, getJobService, getJobByIdService } from "./job.service";

export const createJobHandler = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const job = await createJob(userId, req.body);
    res.status(201).json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getJobsHandler = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const jobs = await getJobService(userId);
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobByIdHandler = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const jobId = req.params.id;
    const job = await getJobByIdService(jobId, userId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
