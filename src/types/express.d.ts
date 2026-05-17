import { JobQuery } from "../modules/job/job.schema";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user:
        | JwtPayload
        | (any & {
            userId: string;
          });

      validatedQuery: JobQuery;
    }
  }
}

export {};
