const itemsController = require("./items-controller");
const storesController = require("./stores-controller");
const merchantsController = require("./merchants-controller");
const fs = require("fs");
const path = require("path");
const { csvToJson, writeJsonToCsv, arrayEqual } = require("./../utils");
const { HTTP_INTERNALERROR } = require("./../constants");
const { MERCHANTS_INGESTION_CSV } = require("./../config");
const cloudStorage = require("./../cloud-storage");

const bucket = cloudStorage.bucket;

// common function to ingest a single merchant given configurations

// Pull merchants.csv and check for new merchants, send request to update
exports.sync = async (req, res) => {
  try {
    const merchantsConfigFile = await bucket.file(MERCHANTS_INGESTION_CSV);
    if (merchantsConfigFile) {
      const merchants = await csvToJson(merchantsConfigFile.createReadStream());
      res.send(merchants);
    } else {
      res.send(`Error: ${MERCHANTS_INGESTION_CSV} Not Found`);
    }
  } catch (err) {
    res.send(`Error: ${err}`);
  }
};

//
exports.update = async (req, res) => {
  // Based on POST body details, update specified merchants
  res.send("SUCCESS");
};

exports.addMerchant = async (req, res) => {
  const reqBody = req.body;
  if (!reqBody["Merchant ID"]) {
    return res.send("Error: No Merchant ID found");
  }
  try {
    const merchantsConfigFile = await bucket.file(MERCHANTS_INGESTION_CSV);
    if (merchantsConfigFile) {
      const merchants = await csvToJson(merchantsConfigFile.createReadStream());
      const header = [...merchants.header];
      const bodyKeys = [...Object.keys(reqBody)];
      // Add merchant specified in request
      if (header && arrayEqual(bodyKeys.sort(), header.sort())) {
        merchants.data.push(reqBody);
      } else if (!header) {
        merchants.data.push(reqBody);
      }
      // Write to RAM (temporary)
      const tmpFile = "/tmp/merchants.csv";
      fs.closeSync(fs.openSync(tmpFile, "w"));
      // Parse object into .csv and write, waiting for completion
      await writeJsonToCsv(merchants, fs.createWriteStream(tmpFile));
      // Upload to replace bucket file
      fs.createReadStream(tmpFile)
        .pipe(merchantsConfigFile.createWriteStream({ resumable: false }))
        .on("error", (err) => console.error(err));
    } else {
      res.send(`Error: merchants.csv Not Found`);
    }
  } catch (err) {
    res.send(`Error: ${err}`);
  }
  res.send("SUCCESS");
};

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.send("Error: no file data");
  }
  try {
    const newFile = await bucket.file(req.file.originalname);
    fs.createReadStream(req.file.path)
      .pipe(newFile.createWriteStream({ resumable: false }))
      .on("error", (err) => console.error(err));
  } catch (err) {
    res.send(`Error: ${err}`);
  }
  res.send("SUCCESS");
};
