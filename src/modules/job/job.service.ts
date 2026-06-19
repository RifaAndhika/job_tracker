import { id } from "zod/locales";
import {prisma} from "../../config/prisma";
import { JobQueryType, CreateJobInput } from "./job.schema";


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
      return prisma.jobApplication.create({
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
    };


  export const getJobByIdService = async (jobId: string, userId: string) => {
      const job = await prisma.jobApplication.findFirst({
        where: { id: jobId, userId: userId },
      });

      if (!job) {
        const error: any = new Error("Job application not found");
        error.statusCode = 404;
        throw error;
      }

      return job;
    };


    export const updateJobService = async (userId: string, jobId: string, data: any) => {
      const existingJob = await prisma.jobApplication.findFirst({
        where: { id: jobId, userId: userId },
      });

      if (!existingJob) {
        const error: any = new Error("Job application not found");
        error.statusCode = 404;
        throw error;
      }

      return prisma.jobApplication.update({
        where: { id: jobId, userId: userId },
        data,
      });
    };

export const deleteJobService = async (userId: string, jobId: string) => {
   const existingJob = await prisma.jobApplication.findFirst({
        where: { id: jobId, userId: userId },
      }); 

        if(!existingJob){
            const error: any = new Error("Job application not found");
          error.statusCode = 404;
          throw error;
        }

  return prisma.jobApplication.delete({
    where: {
      id: jobId,
      userId: userId,
    },
  });
};
