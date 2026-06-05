import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateQueryJob =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const validatedQuery = schema.parse(req.query);
    req.validatedQuery = validatedQuery;
    next();
  };
