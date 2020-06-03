const stores = require("./../data/stores.json");

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

exports.storesGet = async (req, res) => {
  let reqProps = req.body;
  let retStores = [];
  let limDist = 2000;

  if (reqProps["distance"]) {
    // Limit search radius
    limDist = reqProps["distance"];
  }

  //TODO(#9) Implement searching with keywords
  // Use searching instead
  // if (reqProps.['search']){

  // }

  if (reqProps["latitude"] && reqProps["longitude"]) {
    let userLat = reqProps["latitude"];
    let userLong = reqProps["longitude"];
    for (let i = 0; i < stores.length; ++i) {
      let lat = stores[i]["latitude"];
      let long = stores[i]["longitude"];
      let curDist = geoDist(userLat, userLong, lat, long);
      console.log("distance: " + curDist);
      if (curDist < limDist) {
        retStores.push(Object.assign({}, stores[i], { distance: curDist }));
      }
    }
  }
  res.json(retStores);
};

exports.storeGet = async (req, res) => {
  let reqProps = req.body;
  let retStore = {};
  if (reqProps["store-id"]) {
    for (let i = 0; i < stores.length; ++i) {
      if (stores[i]["store-id"] == reqProps["store-id"]) {
        retStore = stores[i];
        break;
      }
    }
  }
  res.json(retStore);
};
