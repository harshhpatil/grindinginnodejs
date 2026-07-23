# Logging & Monitoring Notes (Node.js)

## What is Logging?

Logging means recording events happening inside an application.

Examples:

* User logged in
* Payment failed
* Database disconnected
* Server crashed
* API request completed

Logging helps developers:

* debug issues
* monitor system behavior
* track errors
* understand application flow
* analyze production problems

---

# Types of Logging

## 1. Request Logging

Tracks incoming HTTP requests.

Example:

```txt
GET /users 200 15ms
```

This includes:

* HTTP method
* route
* status code
* response time

Used for:

* API monitoring
* traffic analysis
* debugging requests

---

## 2. Application Logging

Tracks application-level events.

Examples:

* User created
* Token verified
* Payment failed
* Database connected
* Cache miss

This is the most important logging type in backend systems.

---

# Morgan

Morgan is a middleware used for HTTP request logging in Express applications.

Example:

```txt
GET / 200 3ms
```

Morgan logs:

* request method
* route
* status code
* response time

Example Setup:

```js
const morgan = require("morgan");

app.use(morgan("dev"));
```

Morgan is mainly used for:

* development logging
* request tracking
* debugging APIs

---

# Winston

Winston is a powerful Node.js logging library used for application logging.

It supports:

* log levels
* file logging
* JSON logging
* metadata
* multiple transports
* log rotation

Example:

```js
logger.info("User logged in");
```

---

# Log Levels

| Level | Meaning                 |
| ----- | ----------------------- |
| error | Something failed        |
| warn  | Suspicious behavior     |
| info  | Important normal events |
| debug | Detailed debugging info |

Examples:

```js
logger.info("Server started");
logger.warn("High memory usage");
logger.error("Database connection failed");
```

---

# Structured JSON Logging

Production systems usually use JSON logs.

Example:

```json
{
  "level": "info",
  "message": "User logged in",
  "timestamp": "2026-05-24T10:30:00Z"
}
```

Why JSON logs?

* machine readable
* easy parsing
* centralized logging support
* works with Grafana, ELK, Datadog, Loki

JSON logs are used heavily in production systems.

---

# Metadata in Logs

Metadata provides extra information about events.

Example:

```js
logger.info("Route accessed", {
  route: "/users",
  method: "GET",
  userId: 42,
});
```

Useful metadata:

* user id
* request id
* route
* IP address
* service name
* request method

Metadata makes debugging easier.

---

# Persistent Logging

By default terminal logs disappear after the application stops.

Persistent logging saves logs into files.

Example:

```js
new winston.transports.File({
  filename: "logs/combined.log",
});
```

Benefits:

* crash investigation
* historical logs
* debugging production issues
* audit trails

---

# Error Logs

Production systems often separate error logs from normal logs.

Example:

```js
new winston.transports.File({
  filename: "logs/error.log",
  level: "error",
});
```

Why?

* easier debugging
* faster incident analysis
* reduced noise

---

# Log Rotation

Log files grow continuously.

Without rotation:

```txt
combined.log -> 10GB+
```

Log rotation:

* creates daily logs
* compresses old logs
* deletes old files automatically

Example:

```js
new DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
});
```

Benefits:

* storage management
* easier maintenance
* organized logs

---

# Monitoring

Monitoring means continuously checking system health and performance.

Monitoring helps track:

* CPU usage
* memory usage
* API latency
* traffic
* request count
* errors
* uptime

Logging answers:

```txt
What happened?
```

Monitoring answers:

```txt
How healthy is the system?
```

---

# Metrics

Metrics are numerical values representing system behavior over time.

Examples:

* requests per second
* memory usage
* CPU usage
* response times
* active users

Metrics are usually time-series data.

---

# Prometheus

Prometheus is a monitoring and metrics collection system.

It works by scraping metrics endpoints.

Example:

```txt
/metrics
```

Prometheus collects:

* system metrics
* application metrics
* custom metrics

Example metrics:

```txt
process_cpu_user_seconds_total
process_resident_memory_bytes
http_requests_total
```

---

# Grafana

Grafana is a dashboard and visualization tool.

Grafana is used to:

* create dashboards
* visualize metrics
* monitor systems
* create alerts

Grafana mainly displays data from Prometheus.

Think:

```txt
Prometheus = backend
Grafana = frontend
```

---

# Counters

Counters only increase.

Examples:

* total requests
* total errors
* total logins

Example:

```js
const counter = new client.Counter({
  name: "http_requests_total",
  help: "Total requests",
});
```

---

# Histograms

Histograms measure distributions.

Mostly used for:

* API latency
* response times
* request durations

Example:

```js
const histogram = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Request duration",
});
```

Histograms are important for performance monitoring.

---

# Observability

Observability means understanding system behavior using:

* logs
* metrics
* traces

Goal:

* detect issues
* debug faster
* understand production systems

Observability is a major backend engineering concept.

---

# Error Handling

Error handling prevents messy crashes and inconsistent responses.

Centralized error handling:

* handles errors in one place
* logs errors properly
* sends consistent responses

Example:

```js
app.use(errorHandler);
```

Benefits:

* cleaner code
* structured errors
* easier debugging

---

# Uncaught Exceptions

Unexpected synchronous crashes.

Example:

```js
nonExistingFunction();
```

Handled using:

```js
process.on("uncaughtException", (err) => {
  logger.error(err.message);
  process.exit(1);
});
```

---

# Unhandled Promise Rejections

Unhandled async failures.

Example:

```js
Promise.reject("DB FAILED");
```

Handled using:

```js
process.on("unhandledRejection", (reason) => {
  logger.error(reason);
  process.exit(1);
});
```

---

# Why Production Systems Exit After Critical Errors

After severe crashes the application may become unstable or corrupted.

Best practice:

* log the issue
* safely terminate process
* restart application cleanly

Usually managed using:

* PM2
* Docker
* Kubernetes

---

# Golden Signals (Google SRE)

The 4 important monitoring signals:

| Signal     | Meaning               |
| ---------- | --------------------- |
| Latency    | How fast requests are |
| Traffic    | Number of requests    |
| Errors     | Failure rate          |
| Saturation | Resource usage        |

These are core production monitoring concepts.

---

# Concepts To Learn Further

## Logging & Monitoring Advanced Topics

* ELK Stack
* Loki
* Datadog
* OpenTelemetry
* Jaeger
* Distributed tracing
* Correlation IDs
* Centralized logging
* Alerting systems
* SLO / SLA / SLI
* APM systems
* Kubernetes monitoring
* Docker monitoring
* Service mesh observability

---

# Tools Learned

| Tool                      | Purpose                        |
| ------------------------- | ------------------------------ |
| Morgan                    | HTTP request logging           |
| Winston                   | Application logging            |
| Prometheus                | Metrics collection             |
| Grafana                   | Metrics visualization          |
| prom-client               | Prometheus metrics for Node.js |
| winston-daily-rotate-file | Log rotation                   |

---


