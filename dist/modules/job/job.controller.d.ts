import { Response, Request } from "express";
export declare const createJobHandler: (req: Request, res: Response) => Promise<void>;
export declare const getJobsHandler: (req: Request, res: Response) => Promise<void>;
export declare const getJobByIdHandler: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const updateJobHandler: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const deleteJobHandler: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
//# sourceMappingURL=job.controller.d.ts.map