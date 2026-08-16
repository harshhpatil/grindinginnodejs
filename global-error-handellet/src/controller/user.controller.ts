import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.ts";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = fakeDatabaseCall();

    if (!user) {
      // passing known errors to the global handler
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    // passing unknown errors to the global handler
    next(error);
  }
};

const fakeDatabaseCall = () => {
  return null;
};
