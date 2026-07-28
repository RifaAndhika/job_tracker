import { prisma } from "../../config/prisma";
import { getCached, setCache, dashboardCacheKey } from "../../utils/cache";

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
  grouped.forEach((item: any) => {
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
  const grouped = await prisma.$queryRaw<
    {
      month: Date;
      count: number;
    }[]
  >`
  SELECT
  TO_CHAR( DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month,
  COUNT(*):: int AS count
  FROM "JobApplication"
  WHERE "userId" = ${userid}
  GROUP BY month
  ORDER BY month ASC
  `;

  return grouped.map((item: any) => ({
    month: item.month,
    count: Number(item.count),
  }));
};

export const getAcceptedRateService = async (userId: string) => {
  const total = await prisma.jobApplication.count({
    where: {
      userId: userId,
    },
  });

  const accepted = await prisma.jobApplication.count({
    where: {
      status: "ACCEPTED",
      userId: userId,
    },
  });

  if (total === 0) return 0;
  return Math.round((accepted / total) * 100);
};

export const getDashboardOverviewService = async (userId: string) => {
  const cachedKey = dashboardCacheKey(userId);
  const cached = await getCached(cachedKey);
  if (cached) {
    return cached; //cache hit -> not query db
  }

  //cache miss → query db
  const [totalApplications, statusStats, monthlyStats, acceptedRate] =
    await Promise.all([
      totalApplicationsService(userId),
      totalApplicationsByStatusService(userId),
      totalApplicationsMonthlyService(userId),
      getAcceptedRateService(userId),
    ]);

  const data = { totalApplications, statusStats, monthlyStats, acceptedRate };

  //set cache
  await setCache(cachedKey, data);

  return data;
};
