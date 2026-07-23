import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",

  labelNames: ["method", "route", "status", "status_code"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",

  labelNames: ["method", "route", "status", "status_code"],

  buckets: [0.1, 0.5, 1, 2, 5],
});


export const register = client.register;
export { httpRequestsTotal, httpRequestDuration };