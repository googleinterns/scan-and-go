const { Firestore } = require("@google-cloud/firestore");

exports.itemsGet = async (req, res) => {
  let reqProps = req.body;
  let retItems = [];
  const firestore = new Firestore();
  const collectionRef = firestore.collection("items");

  try {
    const snapshot = await collectionRef.get();
    const items = snapshot.docs.map((doc) => doc.data());
    if (reqProps["merchant-id"] && reqProps["barcode"]) {
      let queryMerchant = reqProps["merchant-id"];
      let queryBarcodes = new Set(reqProps["barcode"]);
      for (let i = 0; i < items.length; ++i) {
        let merchant_id = items[i]["merchant-id"];
        if (merchant_id != queryMerchant) {
          continue;
        }
        let barcode = items[i]["barcode"];
        if (queryBarcodes.has(barcode)) {
          retItems.push(items[i]);
          console.log(items[i]);
        }
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    res.json(retItems);
  }
};
