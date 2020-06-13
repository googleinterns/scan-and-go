const config = require("./../config");
const firestore = require("./../firestore");
const { ItemsCollection } = require("./../db-consts");
const itemsCollectionRef = firestore.collection(ItemsCollection);
const env = process.env.NODE_ENV || config.DEV;

exports.itemsGet = async (req, res) => {
  const reqProps = req.body;
  let retItems = [];
  const queryMerchant = reqProps["merchant-id"];
  const queryBarcodes = reqProps["barcode"];
  try {
    if (queryMerchant && queryBarcodes) {
      const itemsQueryRef = await itemsCollectionRef
        .where("merchant-id", "==", queryMerchant)
        .where("barcode", "in", queryBarcodes)
        .get();
      retItems = itemsQueryRef.docs.map((doc) => doc.data());
    }
  } catch (err) {
    console.err(err);
  } finally {
    res.json(retItems);
  }
};
