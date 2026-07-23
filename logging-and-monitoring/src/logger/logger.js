import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// creating logger instance
const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),

    winston.format.json(),
  ),

  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: "./logs/errorLogs.log" }),
    // new winston.transports.File({
    //   filename: "./logs/errorLogs.log",
    //   level: "error",
    // }),

    // log rotation
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export default logger;
