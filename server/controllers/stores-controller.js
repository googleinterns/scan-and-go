const config = require("./../config");
const firestore = require("./../firestore");
const { StoresCollection } = require("./../db-consts");
const storesCollectionRef = firestore.collection(StoresCollection);
const env = process.env.NODE_ENV || config.DEV;

function geoDist(lat1, lon1, lat2, lon2) {
  // script taken from: https://www.movable-type.co.uk/scripts/latlong.html
  const R = 6371e3; // metres
  let φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  let φ2 = (lat2 * Math.PI) / 180;
  let Δφ = ((lat2 - lat1) * Math.PI) / 180;
  let Δλ = ((lon2 - lon1) * Math.PI) / 180;

  let a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  let d = R * c; // in metres
  return d;
}

// Extraction of list of stores
exports.storesGet = async (req, res) => {
  const reqProps = req.body;
  let retStores = [];

  const limDist = reqProps["distance"] || 2000; // Limit search radius
  const userLat = reqProps["latitude"];
  const userLong = reqProps["longitude"];

  //TODO(#10) Implement searching with keywords
  try {
    if (userLat && userLong) {
      const storesQuery = await storesCollectionRef.get();
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
exports.storeGet = async (req, res) => {
  const reqProps = req.body;
  let retStore = {};

  const storeID = reqProps["store-id"];

  try {
    if (storeID) {
      const storeQuery = await storesCollectionRef
        .where("store-id", "==", storeID)
        .get();
      const stores = storeQuery.docs.map((doc) => doc.data());
      if (stores.length > 0) {
        retStore = stores[0];
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    res.json(retStore);
  }
};
