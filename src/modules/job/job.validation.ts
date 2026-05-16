import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateQueryJob =
  (schema: z.ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.parse(req.query);

    req.validatedQuery = parsed;

    next();
  };
