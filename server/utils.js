const fs = require("fs");
const readline = require("readline");

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

// CSV row to json objects
exports.csvToJson = async (file, options) => {
  // Verify file exists
  // wrap with filestream to read if param file is type string (file path)
  const fileStream =
    typeof file === "string"
      ? fs.createReadStream(file).on("error", (err) => null)
      : file;
  if (!fileStream) return undefined; // No file exists

  const fileLines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let jsonObj = undefined;

  // default empty options
  if (!options) options = {};
  if (options.noheader) {
    // Parse row as json list
    jsonObj = [];
    for await (line of fileLines) {
      jsonObj.push(line.split(","));
    }
  } else {
    // Parse first row as key
    let header;
    for await (line of fileLines) {
      if (!jsonObj) {
        // Initialize keys
        header = line.split(",").map((cell) => cell.trim());
        jsonObj = [];
      } else {
        const curRow = {};
        // Ensure we have sufficient entries, else ignore row
        const columns = line.split(",").map((cell) => cell.trim());
        if (columns.length < header.length) continue;
        columns.map((col, i) => {
          curRow[header[i]] = col;
        });
        jsonObj.push(curRow);
      }
    }
  }
  return jsonObj;
};
