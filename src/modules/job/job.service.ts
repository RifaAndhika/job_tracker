import prisma from "../../config/prisma";

export const createJobService = async (userId: string, data: any) => {
  return prisma.jobApplication.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getJobService = async (userId: string) => {
  return prisma.jobApplication.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getJobByIdService = async (jobId: string, userId: string) => {
  return prisma.jobApplication.findFirst({
    where: {
      id: jobId,
      userId: userId,
    },
  });
};

export const updateJobService = async (
  userId: string,
  jobId: string,
  data: any,
) => {
  return prisma.jobApplication.updateMany({
    where: {
      id: jobId,
      userId: userId,
    },
    data,
  });
};

export const deleteJobService = async (userId: string, jobId: string) => {
  return prisma.jobApplication.deleteMany({
    where: {
      id: jobId,
      userId: userId,
    },
  });
};
