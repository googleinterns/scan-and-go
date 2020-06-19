const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const apiRouter = require("./routers/api-router");
const config = require("./config");
const { populate } = require("./emulatedFirestore.js");

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

// Error Fallback 404
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).send("Not implemented");
});

// Compresses responses
app.use(compression());

const server = app.listen(PORT, function () {
  console.log(config.ENV);
  if (config.ENV === config.TEST) {
    console.log("Populating emulated Firestore with entries");
    populate();
  }
  console.log(`Server running on: ${PORT}`);
});

exports.app = app;
exports.server = server;
