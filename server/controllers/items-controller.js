const items = require("./../data/items.json");

exports.itemsGet = async (req, res) => {
  let reqProps = req.body;
  let retItems = [];

  if (reqProps["merchant-id"] && reqProps["barcode"]) {
    let queryMerchant = reqProps["merchant-id"];
    let queryBarcodes = new Set(reqProps["barcode"]);
    console.log("Query Items from Merchant: " + queryMerchant);
    console.log("Query List:");
    console.log(queryBarcodes);
    for (let i = 0; i < items.length; ++i) {
      let merchant_id = items[i]["merchant-id"];
      if (merchant_id != queryMerchant) {
        continue;
      }
      let barcode = items[i]["barcode"];
      if (queryBarcodes.has(barcode)) {
        retItems.push(items[i]);
      }
    }
  }
  res.json(retItems);
};
