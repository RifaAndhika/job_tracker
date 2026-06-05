import { Response } from "express";
interface ResponseParams<T> {
    res: Response;
    statusCode?: number;
    success?: boolean;
    data: T;
    message?: string;
    meta?: any;
}
export declare const sendResponse: <T>({ res, statusCode, success, data, message, meta, }: ResponseParams<T>) => void;
export {};
//# sourceMappingURL=sendResponse.d.ts.map