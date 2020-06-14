const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const config = require("./config");
const apiRouter = require("./routers/api-router");

// Development environment is set up to look for port 3143
const PORT = process.env.PORT || config.DEV_PORT;

const app = express();

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

app.listen(PORT, function () {
  console.log(`Server running on: ${PORT}`);
});
