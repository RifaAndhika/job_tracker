import { JobQuery } from "../modules/job/job.schema";
import { AuthPayload } from "./auth";

declare global {
  namespace Express {
    interface Request {
      user: AuthPayload;
      validatedQuery: JobQuery;
    }
  }
}

export {};
