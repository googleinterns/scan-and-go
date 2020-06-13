// Compute the distance on surface of earth given pair
// of (lat, long) geo-locations
exports.geoDist = (lat1, lon1, lat2, lon2) => {
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
};

// Take a list of values and either return first element
// or return an indicated default value (optional)
exports.flatMap = (listVals, defaultVal = null) => {
  return listVals.length > 0 ? listVals[0] : defaultVal;
};
