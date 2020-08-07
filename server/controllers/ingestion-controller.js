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
const {
  itemsCollection,
  storesCollection,
  merchantsCollection,
  ingestionCollection,
} = require("./../firestore");
const cloudStorage = require("./../cloud-storage");

const bucket = cloudStorage.bucket;

// common function to write into firestore collection a list of documents
const writeDocumentsFirestore = async (objList, collection) => {
  try {
    await Promise.all(objList.map(async (obj) => await collection.add(obj)));
  } catch (err) {
    console.error(`Ingestion Batch Write Error: ${err}`);
  }
};

// take in a list of documents and corresponding obj defining fields to update
const updateDocumentsFirestore = (docObjList) => {
  try {
    // Expect a list of (Document Reference, Update Object) tuple
    docObjList.map(([doc, obj]) => doc.update(obj));
  } catch (err) {
    console.error(`Ingestion Batch Update Error: ${err}`);
  }
};

// delete all documents matching references
const deleteDocumentsFirestore = (docRefList) => {
  try {
    docRefList.map((docRef) => docRef.delete());
  } catch (err) {
    console.error(`Ingestion Batch Delete Error: ${err}`);
  }
};

// Log ingestion for merchant
const logIngestionFirestore = (merchantId, statusString) => {
  try {
    ingestionCollection.add({
      timestamp: Date.now(),
      status: statusString,
      merchant: merchantId,
    });
  } catch (err) {
    console.error(`Logging Ingestion Error: ${err}`);
  }
};

// Find merchant by ID
const findMerchantById = (merchantId) => {
  return merchantsCollection
    .where("merchant-id", "==", merchantId)
    .limit(1)
    .get();
};

// Find item by barcode
const findItemByBarcode = (barcode, merchantId) => {
  return itemsCollection
    .where("barcode", "==", barcode)
    .where("merchant-id", "==", merchantId)
    .limit(1)
    .get();
};

// Find store by Id
const findStoreById = (storeId, merchantId) => {
  return storesCollection
    .where("store-id", "==", storeId)
    .where("merchant-id", "==", merchantId)
    .limit(1)
    .get();
};

// Onboard new merchant
const onboardNewMerchant = async (merchant) => {
  const merchantId = merchant["Merchant ID"];
  let processedItems = [];
  let processedStores = [];
  try {
    // Read items file and process csv document
    const itemsFile = await bucket.file(merchant["Items"]);
    const itemsObj = await csvToJson(itemsFile.createReadStream());
    // Read stores file and process csv document
    const storesFile = await bucket.file(merchant["Stores"]);
    const storesObj = await csvToJson(storesFile.createReadStream());
    // Batch write objects into collection after processing
    processedItems = itemsObj.data.map((rawItem) => {
      return {
        barcode: rawItem["SKU Barcode"],
        "merchant-id": merchantId,
        price: parseFloat(rawItem["Price"]),
        unit: rawItem["Unit of Measure"],
        detail: rawItem["Details"],
        name: rawItem["Name"],
      };
    });
    processedStores = storesObj.data.map((rawStore) => {
      //TODO: We can construct our own StoreID mapping as well
      //TODO: Call reverse geolocation API instead to parse Text-based addresses
      const geoCoord = rawStore["Address"].split(":");
      const latitude = geoCoord.length > 1 ? parseFloat(geoCoord[0]) : -1;
      const longitude = geoCoord.length > 1 ? parseFloat(geoCoord[1]) : -1;
      return {
        "merchant-id": merchantId,
        "store-id": rawStore["Store ID"],
        name: rawStore["Name"],
        latitude: latitude,
        longitude: longitude,
        vicinity: rawStore["Address"],
      };
    });
  } catch (err) {
    console.error(`Ingestion New Merchant Error: ${err}`);
    logIngestionFirestore(merchantId, "ERROR: Malformed files");
    return;
  }
  try {
    // Write to merchants collection
    merchantsCollection.add({
      "merchant-id": merchantId,
      "microapp-id": merchant["Microapp ID"],
      payeeVpa: merchant["payeeVpa"],
      name: merchant["Name"],
    });
    writeDocumentsFirestore(processedItems, itemsCollection);
    writeDocumentsFirestore(processedStores, storesCollection);
    // Log successful ingest sync request
    logIngestionFirestore(merchantId, "SUCCESS");
    console.log("INGESTION SUCCESSFUL");
  } catch (err) {
    console.error(`Ingestion New Merchant Error: ${err}`);
    // Write ingestion error log entry
    logIngestionFirestore(merchantId, "ERROR: Unable to onboard new merchant");
    // Rollback incomplete changes
    try {
      // Wipe Merchant
      const merchantQuery = await findMerchantById(merchantId);
      if (!merchantQuery.empty) {
        const merchantDoc = merchantQuery.docs[0];
        merchantDoc.ref.delete();
      }
      // Find and wipe Items
      await Promise.all(
        processedItems.map(async (item) => {
          const itemQuery = await findItemByBarcode(item.barcode, merchantId);
          if (!itemQuery.empty) {
            const itemDoc = itemQuery.docs[0];
            itemDoc.ref.delete();
          }
        })
      );
      // Find and wipe Stores
      await Promise.all(
        processedStores.map(async (store) => {
          const storeQuery = await findStoreById(store["store-id"], merchantId);
          if (!storeQuery.empty) {
            const storeDoc = storeQuery.docs[0];
            storeDoc.ref.delete();
          }
        })
      );
    } catch (err) {
      console.error(`Ingestion Rollback Error: ${err}`);
      //TODO: Retry rollback?
    }
  }
};

// stub function for updating existing merchant information
const updateMerchant = async (merchantDocRef, merchant) => {
  //TODO: Actual updating of information
  // Currently, we wipeout merchant's information and replace with new merchant
  const oldMerchantId = merchantDocRef.data()["merchant-id"];
  // Wipe items/stores found with this merchantId
  const itemsQuery = await itemsCollection
    .where("merchant-id", "==", oldMerchantId)
    .get();
  itemsQuery.docs.map((itemDocRef) => itemDocRef.ref.delete());
  const storesQuery = await storesCollection
    .where("merchant-id", "==", oldMerchantId)
    .get();
  storesQuery.docs.map((storeDocRef) => storeDocRef.ref.delete());
  merchantDocRef.ref.delete();
  // Re-use onboard new flow
  onboardNewMerchant(merchant);
};

// Pull merchants.csv and check for new merchants, send request to update
exports.sync = async (req, res) => {
  try {
    // Ingestion status document
    const ingestionStatusDoc = ingestionCollection.doc(
      INGESTION_STATUS_DOCUMENT
    );
    console.log(ingestionStatusDoc);
    // Last ingestion time
    const lastUpdateTimestamp = await ingestionStatusDoc
      .get()
      .then((doc) => doc.get("timestamp"));
    console.log(lastUpdateTimestamp);
    const lastUpdateDate = new Date(lastUpdateTimestamp);
    console.log(`Latest update time: ${lastUpdateDate}`);
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
      const merchantFiles = await Promise.all(
        merchants.data.map(async (merchant) => {
          const itemsMeta = await bucket
            .file(merchant["Items"])
            .getMetadata()
            .then((data) => data[0])
            .catch((err) => null);
          const storesMeta = await bucket
            .file(merchant["Stores"])
            .getMetadata()
            .then((data) => data[0])
            .catch((err) => null);
          return {
            items: itemsMeta.updated,
            stores: storesMeta.updated,
          };
        })
      );

      console.log(merchantFiles);

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
          console.log(
            `Has Update: ${
              lastUpdateDate < itemsLastUpdateDate ||
              lastUpdateDate < storesLastUpdateDate
            }`
          );
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
          console.error(err);
        }
        return false;
      });
      if (onboardMerchants.length > 0) {
        //TODO: Parse files and Begin merchant onboarding flow
        for (const curMerchant of onboardMerchants) {
          // Create/update merchants collection
          const curMerchantQuery = await findMerchantById(
            curMerchant["Merchant ID"]
          );
          if (curMerchantQuery.empty) {
            try {
              onboardNewMerchant(curMerchant);
            } catch (err) {
              console.error(`Unable to onboard ${curMerchant}: ${err}`);
            }
          } else {
            const curMerchantDocRef = curMerchantQuery.docs[0];
            try {
              updateMerchant(curMerchantDocRef, curMerchant);
            } catch (err) {
              console.error(`Unable to onboard ${curMerchant}: ${err}`);
            }
          }
        }
        // Log last sync time
        ingestionStatusDoc.update({
          timestamp: Date.now(),
        });
      }
      // Respond with which merchants have been updated
      // Since CronJob, nobody will be here to see it tho -> unless debugging from Localhost
      res.send(onboardMerchants);
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

exports.resetSyncTiming = async (req, res) => {
  try {
    const syncStatusDoc = await ingestionCollection.doc(
      INGESTION_STATUS_DOCUMENT
    );
    syncStatusDoc.update({
      timestamp: 0,
    });
  } catch (err) {
    res.send(`Error: ${err}`);
  }
  res.send("Sync Timestamp RESET");
};
