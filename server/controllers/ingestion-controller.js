const itemsController = require("./items-controller");
const storesController = require("./stores-controller");
const merchantsController = require("./merchants-controller");
const fs = require("fs");
const path = require("path");
const { csvToJson, writeJsonToCsv, arrayEqual } = require("./../utils");
const { HTTP_INTERNALERROR } = require("./../constants");
const { MERCHANTS_INGESTION_CSV } = require("./../config");
const { merchantsCollection, ingestionCollection } = require("./../firestore");
const cloudStorage = require("./../cloud-storage");

const bucket = cloudStorage.bucket;

// common function to ingest a single merchant given configurations

// Pull merchants.csv and check for new merchants, send request to update
exports.sync = async (req, res) => {
  try {
    const merchantsConfigFile = await bucket.file(MERCHANTS_INGESTION_CSV);
    if (merchantsConfigFile) {
      const merchants = await csvToJson(merchantsConfigFile.createReadStream());
      // Look into currently available merchants
      const availMerchantsQuery = await merchantsCollection.get();
      const availMerchants = availMerchantsQuery.docs
        .map((doc) => doc.data())
        .map((merchant) => merchant["merchant-id"]);
      // Filter merchants to be onboarded
      const onboardMerchants = merchants.data.filter((merchant) => {
        if (!availMerchants.includes(merchant["Merchant ID"])) return true;
        //TODO: Verify if changes to item/store files were made since last update
        return false;
      });
      if (onboardMerchants.length > 0) {
        //TODO: Parse files and Begin merchant onboarding flow
      }
      // Log ingest sync request
      ingestionCollection.add({
        timestamp: Date.now(),
        status: "SUCCESS",
        merchants: onboardMerchants.length
          ? onboardMerchants.map((merchant) => merchant["Merchant ID"])
          : [],
      });
      res.send(merchants);
    } else {
      res.send(`Error: ${MERCHANTS_INGESTION_CSV} Not Found`);
    }
  } catch (err) {
    res.send(`Error: ${err}`);
  }
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
