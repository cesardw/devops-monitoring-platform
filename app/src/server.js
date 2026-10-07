const express = require("express");
const client = require("prom-client");

const app = express();

const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || "1.1.0";
const ENVIRONMENT = process.env.NODE_ENV || "development";

// 1. Registro de métricas
const register = new client.Registry();

// 2. Colectar métricas predeterminadas
client.collectDefaultMetrics({ register });

// 3. Métricas HTTP
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Número total de peticiones HTTP recibidas",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestDurationSeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duración de las peticiones HTTP en segundos",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5]
});

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDurationSeconds);

// 4. Middleware
app.use((req, res, next) => {
  if (req.path === "/metrics") return next();

  const start = Date.now();
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;

    httpRequestCounter.labels(req.method, route, res.statusCode.toString()).inc();
    httpRequestDurationSeconds.labels(req.method, route, res.statusCode.toString()).observe(duration);
  });
  next();
});

// 5. Rutas normales
app.get("/", (req, res) => {
  res.json({
    application: "PRUEBA DE APLICACION, DEVOPS EN PROCESO",
    version: VERSION,
    environment: ENVIRONMENT,
    status: "online"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// 6. Endpoint Prometheus
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});