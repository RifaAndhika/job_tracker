import { redis } from "../config/redis";
import { logger } from "../libs/logger";

const DASHBOARD_TTL = 60 * 5;

export const getCached = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.error({ err }, "Cache get error");
    return null;
  }
};

export const setCache = async (
  key: string,
  data: unknown,
  ttl = DASHBOARD_TTL,
): Promise<void> => {
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttl);
    logger.info(`Cache set, ${key}`);
  } catch (err) {
    logger.error({ err }, "Cache set error");
    //not throw error - cache miss not reason for failed request
  }
};

export const invalidateCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (err) {
    logger.error({ err }, "Cache invalidate error");
  }
};

export const dashboardCacheKey = (userId: string) => `dashboard:${userId}`;
