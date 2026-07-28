import { prisma } from "../../config/prisma";
import { JobQueryType, CreateJobInput, UpdateJobInput } from "./job.schema";
import { AppError } from "../../utils/appError";
import { invalidateCache, dashboardCacheKey } from "../../utils/cache";

export const getJobService = async (userId: string, query: JobQueryType) => {
  const { status, search, page, limit, sort, sortBy } = query;
  const skip = (page - 1) * limit;

  const whereClause = {
    userId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { companyName: { contains: search, mode: "insensitive" as const } },
        { position: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [jobs, total] = await prisma.$transaction([
    prisma.jobApplication.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sort },
      skip,
      take: limit,
    }),
    prisma.jobApplication.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: jobs,
    meta: { total, page, limit, totalPages },
  };
};

export const createJobService = async (
  userId: string,
  data: CreateJobInput,
) => {
  const job = await prisma.jobApplication.create({
    data: {
      userId,
      companyName: data.companyName,
      position: data.position,
      status: data.status,
      appliedDate: new Date(data.appliedDate),
      ...(data.source !== undefined && { source: data.source }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });
  await invalidateCache(dashboardCacheKey(userId));
  return job;
};

export const getJobByIdService = async (jobId: string, userId: string) => {
  const job = await prisma.jobApplication.findFirst({
    where: { id: jobId, userId: userId },
  });

  if (!job) {
    throw new AppError("Job application not found", 404);
  }

  return job;
};

export const updateJobService = async (
  userId: string,
  jobId: string,
  data: UpdateJobInput,
) => {
  const existingJob = await prisma.jobApplication.findFirst({
    where: { id: jobId, userId: userId },
  });
  if (!existingJob) {
    throw new AppError("Job application not found", 404);
  }
  const job = await prisma.jobApplication.update({
    where: { id: jobId },
    data: {
      companyName: data.companyName,
      position: data.position,
      status: data.status,
      appliedDate: new Date(data.appliedDate),
      ...(data.source !== undefined && { source: data.source }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });

  await invalidateCache(dashboardCacheKey(userId));
  return job;
};

export const deleteJobService = async (userId: string, jobId: string) => {
  const existingJob = await prisma.jobApplication.findFirst({
    where: { id: jobId, userId: userId },
  });

  if (!existingJob) {
    throw new AppError("Job application not found", 404);
  }

  const job = await prisma.jobApplication.delete({
    where: {
      id: jobId,
    },
  });

  await invalidateCache(dashboardCacheKey(userId));
  return job;
};

// # Test cache hit
// curl http://localhost:3000/api/dashboard/analytics/overview \
//   -H "Authorization: Bearer <token>"
