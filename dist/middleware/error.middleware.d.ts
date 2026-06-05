import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
export declare const errorMiddleware: (err: AppError, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map