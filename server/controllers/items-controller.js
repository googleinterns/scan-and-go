const config = require("./../config");
const { itemsCollection } = require("./../firestore");
const { chunk } = require("./../utils");
const CONSTANTS = require("./../constants");

exports.getItems = async (req, res) => {
  const reqProps = req.body;
  let retItems = [];

  const queryMerchant = reqProps["merchant-id"];
  const queryBarcodes = reqProps["barcode"];

  try {
    if (queryMerchant && queryBarcodes) {
      // Batch into queries of up to 10 barcodes to meet Firestore in operator limit
      const queryBarcodesBatched = chunk(
        queryBarcodes,
        CONSTANTS.FIRESTORE_MAX_NUM_CLAUSES
      );
      const retItemsBatched = await Promise.all(
        queryBarcodesBatched.map(async (queryBarcodesBatch) => {
          const itemsQueryRef = await itemsCollection
            .where("merchant-id", "==", queryMerchant)
            .where("barcode", "in", queryBarcodesBatch)
            .get();
          return itemsQueryRef.docs.map((doc) => doc.data());
        })
      );
      retItems = [].concat(...retItemsBatched);
    }
  } catch (err) {
    console.error(err);
  } finally {
    res.json(retItems);
  }
};
