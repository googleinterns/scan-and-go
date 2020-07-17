const fs = require("fs");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const { CLOUD_BUCKET } = require("./config");

const cloudStorage = new Storage();
const appBucket = cloudStorage.bucket(CLOUD_BUCKET);

exports.storage = cloudStorage;
exports.bucket = appBucket;

exports.downloadFile = async (file, destFile) => {
  fs.closeSync(fs.openSync(destFile, "w"));
  await file
    .createReadStream()
    .on("error", (err) => console.log(err))
    .on("response", (response) => console.log(`Connected: ${response}`))
    .on("end", () => console.log("Downloaded"))
    .pipe(fs.createWriteStream(destFile));
};
