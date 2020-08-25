const { storesCollection } = require("./../firestore");
const { geoDist, flatMap } = require("./../utils");
const {
  DEFAULT_SEARCH_RADIUS_METERS,
  DEFAULT_QUERY_LIMIT,
} = require("./../constants");

// Extraction of list of stores
exports.listStores = async (req, res) => {
  const reqProps = req.body;
  let retStores = [];

  const distLim = reqProps["distance"] || DEFAULT_SEARCH_RADIUS_METERS; // Limit search radius
  const userLat = reqProps["latitude"];
  const userLong = reqProps["longitude"];
  const queryLim = reqProps["queryLimit"];

  //TODO(#10) Implement searching with keywords
  try {
    if (userLat && userLong) {
      const storesQuery = await storesCollection.get();
      const stores = storesQuery.docs.map((doc) => doc.data());
      for (let store of stores) {
        const lat = store["latitude"];
        const long = store["longitude"];
        const curDist = geoDist(userLat, userLong, lat, long);
        if (curDist < distLim) {
          retStores.push(Object.assign({}, store, { distance: curDist }));
        }
      }
    } else {
      const storesQuery = queryLim
        ? await storesCollection.orderBy("name").limit(queryLim).get()
        : await storesCollection.orderBy("name").get();
      retStores = storesQuery.docs.map((doc) =>
        Object.assign({}, doc.data(), { distance: undefined })
      );
    }
  } catch (err) {
    console.error(err);
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
    console.error(err);
  } finally {
    res.json(retStore);
  }
};
