const itemsController = require("./items-controller");
const storesController = require("./stores-controller");
const merchantsController = require("./merchants-controller");
const fs = require("fs");
const path = require("path");
const { csvToJson, writeJsonToCsv, arrayEqual } = require("./../utils");
const { HTTP_INTERNALERROR } = require("./../constants");
const {
  MERCHANTS_INGESTION_CSV,
  INGESTION_STATUS_DOCUMENT,
} = require("./../config");
const { merchantsCollection, ingestionCollection } = require("./../firestore");
const cloudStorage = require("./../cloud-storage");

const bucket = cloudStorage.bucket;

// common function to ingest a single merchant given configurations

// Pull merchants.csv and check for new merchants, send request to update
exports.sync = async (req, res) => {
  try {
    // Ingestion status document
    const ingestionStatusDoc = ingestionCollection.doc(
      INGESTION_STATUS_DOCUMENT
    );
    // Last ingestion time
    const lastUpdateTimestamp = await ingestionStatusDoc
      .get()
      .then((doc) => doc.get("timestamp"));
    console.log(`Latest update time: ${lastUpdateTimestamp}`);
    const lastUpdateDate = Date.parse(lastUpdateTimestamp);
    // Read input configuration
    const merchantsConfigFile = await bucket.file(MERCHANTS_INGESTION_CSV);
    if (merchantsConfigFile) {
      const merchants = await csvToJson(merchantsConfigFile.createReadStream());
      // Look into currently available merchants
      const availMerchantsQuery = await merchantsCollection.get();
      const availMerchants = availMerchantsQuery.docs
        .map((doc) => doc.data())
        .map((merchant) => merchant["merchant-id"]);
      // Prepare for filtering by loading config file meta data
      const merchantFiles = Promise.all(
        merchants.data.map((merchant) => {
          const itemsMeta = bucket
            .file(merchant["Items"])
            .getMetadata()
            .catch((err) => null);
          const storesMeta = bucket
            .file(merchant["Stores"])
            .getMetadata()
            .catch((err) => null);
          return {
            items: itemsMeta,
            stores: storesMeta,
          };
        })
      );

      // Filter merchants to be onboarded
      const onboardMerchants = merchants.data.filter((merchant, idx) => {
        if (!availMerchants.includes(merchant["Merchant ID"])) return true;
        //TODO: Verify if changes to item/store files were made since last update
        // Read file metadata for modify time
        try {
          //TODO: handle case where config is API endpoints instead of filenames
          //Flag malformed merchants
          if (!merchantFiles[idx].items || !merchantFiles[idx].stores) {
            ingestionCollection.add({
              timestamp: Date.now(),
              status: "ERROR: File Missing",
              merchant: merchant["Merchant ID"],
            });
            return false;
          }
          // Parse updatetime metadata to filter for new files
          const itemsLastUpdateDate = Date.parse(merchantFiles[idx].items);
          const storesLastUpdateDate = Date.parse(merchantFiles[idx].stores);
          if (
            lastUpdateDate < itemsLastUpdateDate ||
            lastUpdateDate < storesLastUpdateDate
          ) {
            return true;
          } else return false;
        } catch (err) {
          console.error(
            "/ingest/sync cannot read merchant items/stores file metadata"
          );
        }
        return false;
      });
      if (onboardMerchants.length > 0) {
        //TODO: Parse files and Begin merchant onboarding flow
        for (const curMerchant of onboardMerchants) {
          // Create/update merchants collection
          const curMerchantQuery = await merchantsCollection
            .where("merchant-id", "==", curMerchant["Merchant ID"])
            .limit(1)
            .get();
          if (curMerchantQuery.empty) {
            // Add to collection
            merchantsCollection.add({
              "merchant-id": curMerchant["Merchant ID"],
              "microapp-id": curMerchant["Microapp ID"],
              payeeVpa: curMerchant["payeeVpa"],
              name: curMerchant["Name"],
            });
          } else {
            // Update document
            const curMerchantDoc = curMerchantQuery.docs.map((doc) =>
              doc.data()
            )[0];
            curMerchantDoc.update({
              "merchant-id": curMerchant["Merchant ID"],
              "microapp-id": curMerchant["Microapp ID"],
              payeeVpa: curMerchant["payeeVpa"],
              name: curMerchant["Name"],
            });
          }
          // Log successful ingest sync request
          ingestionCollection.add({
            timestamp: Date.now(),
            status: "SUCCESS",
            merchant: curMerchant["Merchant ID"],
          });
        }
      }
      // Log last sync time
      ingestionStatusDoc.update({
        timestamp: Date.now(),
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
