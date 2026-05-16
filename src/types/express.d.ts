import { JobQuery } from "../modules/job/job.schema";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };

      validatedQuery?: JobQuery;
    }
  }
}

export {};
