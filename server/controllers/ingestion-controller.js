const itemsController = require("./items-controller");
const storesController = require("./stores-controller");
const merchantsController = require("./merchants-controller");
const fs = require("fs");
const path = require("path");
const { csvToJson } = require("./../utils");
const { HTTP_INTERNALERROR } = require("./../constants");
const { MERCHANTS_INGESTION_CSV } = require("./../config");
const cloudStorage = require("./../cloud-storage");

const bucket = cloudStorage.bucket;

exports.sync = async (req, res) => {
  try {
    const merchantsConfigFile = await bucket.file(MERCHANTS_INGESTION_CSV);
    if (merchantsConfigFile) {
      const merchants = await csvToJson(merchantsConfigFile.createReadStream());
      res.send(merchants);
    } else {
      res.send(`Error: merchants.csv Not Found`);
    }
  } catch (err) {
    res.send(`Error: ${err}`);
  }
};

exports.update = async (req, res) => {
  // Based on POST body details, update specified merchants
  res.send("SUCCESS");
};
