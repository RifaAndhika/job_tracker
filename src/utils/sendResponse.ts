import { Response } from "express";

interface ResponseParams<T> {
  res: Response;
  statusCode?: number;
  success?: boolean;
  data: T;
  message?: string;
  meta?: any;
}

export const sendResponse = <T>({
  res,
  statusCode,
  success,
  data,
  message,
  meta,
}: ResponseParams<T>) => {
  res.status(statusCode || 200).json({
    success,
    message,
    data,
    meta,
  });
};
