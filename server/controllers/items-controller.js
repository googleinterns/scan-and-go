const config = require("./../config");
const { itemsCollection } = require("./../firestore");
const { flatMap } = require("./../utils");

exports.listItems = async (req, res) => {
  const reqProps = req.body;
  let retItems = [];

  const queryMerchant = reqProps["merchant-id"];
  const queryBarcodes = reqProps["barcode"];

  try {
    if (queryMerchant && queryBarcodes) {
      //TODO(#58) We need to batch this into max 10 barcodes per query
      const itemsQueryRef = await itemsCollection
        .where("merchant-id", "==", queryMerchant)
        .where("barcode", "in", queryBarcodes)
        .get();
      retItems = itemsQueryRef.docs.map((doc) => doc.data());
    }
  } catch (err) {
    console.error(err);
  } finally {
    res.json(retItems);
  }
};

exports.getItem = async (req, res) => {
  const reqProps = req.body;
  let retItem = {};

  const queryMerchant = reqProps["merchant-id"];
  const queryBarcode = reqProps["barcode"];

  try {
    if (queryMerchant && queryBarcode) {
      const itemQueryRef = await itemsCollection
        .where("merchant-id", "==", queryMerchant)
        .where("barcode", "==", queryBarcode)
        .get();
      const items = itemQueryRef.docs.map((doc) => doc.data());
      retItem = flatMap(items, {});
    }
  } catch (err) {
    console.error(err);
  } finally {
    res.json(retItem);
  }
};
