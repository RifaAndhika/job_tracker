import prisma from "../../config/prisma";

export const createJobService = async (userId: string, data: any) => {
  return prisma.jobApplication.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getJobService = async (userId: string, query: any) => {
  const { status, search, page, limit } = query;
  const skip = (page - 1) * limit;
  const jobs = await prisma.jobApplication.findMany({
    where: {
      userId,
      ...(status && { status }),
      ...(search && {
        OR: [
          { companyName: { contains: search, mode: "insensitive" } },
          { position: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });
  const total = await prisma.jobApplication.count({
    where: {
      userId,
      ...(status && { status }),
      ...(search && {
        OR: [
          { companyName: { contains: search, mode: "insensitive" } },
          { position: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data: jobs,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
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
