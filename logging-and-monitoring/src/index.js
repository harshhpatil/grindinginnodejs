import express from "express";
import morgan from "morgan";

import logger from "./logger/logger.js";
import {
  register,
  httpRequestsTotal,
  httpRequestDuration,
} from "./monitoring/metrics.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status_code: res.statusCode,
      },
      duration,
    );
  });
  next();
});

app.get("/", (req, res) => {
  logger.info("Received a request to the root endpoint", {
    route: "/",
    method: req.method,
    ip: req.ip,
  });
  res.json({
    success: true,
  });
});
app.get("/test", (req, res) => {
  logger.info("Info log");
  logger.warn("Warning log");
  logger.error("Error log");

  res.send("Check terminal");
});
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  logger.info("Server running on port 3000");
});
