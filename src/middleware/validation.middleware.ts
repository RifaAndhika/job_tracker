import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };

export const validateQueryJob =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const validatedQuery = schema.parse(req.query);
    req.validatedQuery = validatedQuery;
    next();
  };
