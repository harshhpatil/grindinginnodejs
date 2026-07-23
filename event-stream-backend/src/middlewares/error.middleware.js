import { logger } from "../utils/logger.js";

// global error handler middleware function
const errorHandeler = (err, req, res, next) => {
  logger.error("Unhandled error:", { message: err.message, stack: err.stack });

  const status = err.status || 500;
  res
    .status(status)
    .json({ message: status === 500 ? "Internal Server Error" : err.message });
};
