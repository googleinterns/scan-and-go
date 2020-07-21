const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const apiRouter = require("./routers/api-router");
const ingestionRouter = require("./routers/ingestion-router");
const config = require("./config");
require("dotenv").config();

const app = express();

// Development environment is set up to look for port 3143
const PORT = process.env.PORT || config.DEV_PORT;

// Enable cross-domain requests from our frontend server
app.use(
  cors({
    origin: "https://scan-and-go-for-gpay.an.r.appspot.com/",
  })
);

// Added Security: https://helmetjs.github.io/
app.use(helmet());
// Parse incoming requests with json payloads
app.use(express.json());
// Parse urlencoded payloads into req.body
app.use(express.urlencoded({ extended: false }));

// Main API Router
app.use("/api", apiRouter);

// Backend Ingestion Router (not visible to client)
// client requests from scan-and-go-for-gpay frontend
// will reach 404 NotFound instead due to dispatch.yaml rules
// requests made directly to api-dot-scan-and-go-for-gpay
// will have to pass through authentication checks described
// in authentication.js -> CronAuth and DebugAuth
app.use("/ingest", ingestionRouter);

// Error Fallback 404
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).send("Not implemented");
});

// Compresses responses
app.use(compression());

const server = app.listen(PORT, function () {
  console.log(`Server running on: ${PORT}`);
});

exports.app = app;
exports.server = server;
