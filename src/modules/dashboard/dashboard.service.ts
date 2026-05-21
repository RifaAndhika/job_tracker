import prisma from "../../config/prisma";

export const totalApplicationsService = async (userid: string) => {
  const total = await prisma.jobApplication.count({
    where: {
      userId: userid,
    },
  });
  return total;
};

export const totalApplicationsByStatusService = async (userid: string) => {
  const grouped = await prisma.jobApplication.groupBy({
    by: ["status"],
    where: {
      userId: userid,
    },
    _count: {
      status: true,
    },
  });

  const analytics = {
    total: 0,
    APPLIED: 0,
    SCREENING: 0,
    INTERVIEW: 0,
    OFFER: 0,
    REJECTED: 0,
    ACCEPTED: 0,
  };
  grouped.forEach((item) => {
    analytics.total += item._count.status;
    switch (item.status) {
      case "APPLIED":
        analytics.APPLIED = item._count.status;
        break;
      case "ACCEPTED":
        analytics.ACCEPTED = item._count.status;
        break;
      case "REJECTED":
        analytics.REJECTED = item._count.status;
        break;
      case "OFFER":
        analytics.OFFER = item._count.status;
        break;
      case "INTERVIEW":
        analytics.INTERVIEW = item._count.status;
        break;
      case "SCREENING":
        analytics.SCREENING = item._count.status;
        break;
    }
  });
  return analytics;
};

export const totalApplicationsMonthlyService = async (userid: string) => {
  const grouped = await prisma.jobApplication.groupBy({
    by: ["createdAt"],
    where: {
      userId: userid,
    },
    _count: {
      createdAt: true,
    },
  });

  type analitycsMonth = {
    total: 0;
    date: Date;
  };

  const analitycsMonth: analitycsMonth = {
    total: 0,
    date: new Date(),
  };

  grouped.forEach((item) => {
    analitycsMonth.total += item._count.createdAt;
    analitycsMonth.date = item.createdAt;
  });
  return analitycsMonth;
};
