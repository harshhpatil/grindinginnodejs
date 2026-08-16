import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.ts";

export const globalErrorHandeler = async (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,

    // showing the stack trace in the development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
