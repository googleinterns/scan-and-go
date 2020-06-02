const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");

const apiRouter = require("./routers/api-router");

const PORT = process.env.PORT || 3143;

const app = express();

app.use(
  cors({
    origin: "https://scan-and-go-for-gpay.an.r.appspot.com/",
  })
);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).send("Not implemented");
});

app.listen(PORT, function () {
  console.log(`Server running on: ${PORT}`);
});
