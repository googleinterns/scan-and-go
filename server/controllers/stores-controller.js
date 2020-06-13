const config = require("./../config");
const { storesCollection } = require("./../firestore");
const { geoDist, flatMap } = require("./../utils");

// Extraction of list of stores
exports.listStores = async (req, res) => {
  const reqProps = req.body;
  let retStores = [];

  const limDist = reqProps["distance"] || 2000; // Limit search radius
  const userLat = reqProps["latitude"];
  const userLong = reqProps["longitude"];

  //TODO(#10) Implement searching with keywords
  try {
    if (userLat && userLong) {
      const storesQuery = await storesCollection.get();
      const stores = storesQuery.docs.map((doc) => doc.data());
      for (let i = 0; i < stores.length; ++i) {
        let lat = stores[i]["latitude"];
        let long = stores[i]["longitude"];
        let curDist = geoDist(userLat, userLong, lat, long);
        if (curDist < limDist) {
          retStores.push(Object.assign({}, stores[i], { distance: curDist }));
        }
      }
    }
  } catch (err) {
    console.err(err);
  } finally {
    res.json(retStores);
  }
};

// Extraction of a single store details
exports.getStore = async (req, res) => {
  const reqProps = req.body;
  let retStore = {};

  const storeID = reqProps["store-id"];

  try {
    if (storeID) {
      const storeQuery = await storesCollection
        .where("store-id", "==", storeID)
        .get();
      const stores = storeQuery.docs.map((doc) => doc.data());
      retStore = flatMap(stores, {});
    }
  } catch (err) {
    console.log(err);
  } finally {
    res.json(retStore);
  }
};
