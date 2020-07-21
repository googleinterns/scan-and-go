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

// Compare contents of two arrays for equality
exports.arrayEqual = (arr1, arr2) => {
  if (arr1 === arr2) return true;
  if (arr1.length != arr2.length) return false;
  return arr1
    .map((content, i) => {
      return content === arr2[i];
    })
    .reduce((accum, cur) => accum && cur);
};

/*
 * CSV row to json objects
 * {
 *   "header": [], // Heading (if present)
 *   "data": [], // data rows
 * }
 */
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
    jsonObj = { data: [] };
    for await (line of fileLines) {
      jsonObj.data.push(line.split(","));
    }
  } else {
    // Parse first row as key
    for await (line of fileLines) {
      if (!jsonObj) {
        // Initialize keys
        jsonObj = { header: [], data: [] };
        jsonObj.header = line.split(",").map((cell) => cell.trim());
      } else {
        const curRow = {};
        // Ensure we have sufficient entries, else ignore row
        const columns = line.split(",").map((cell) => cell.trim());
        if (columns.length < jsonObj.header.length) continue;
        columns.map((col, i) => {
          curRow[jsonObj.header[i]] = col;
        });
        jsonObj.data.push(curRow);
      }
    }
  }
  return jsonObj;
};

/*
 * Json object to CSV format writing into stream
 * {
 *   "header": [], // Use as first row if present
 *   "data": [], // otherwise, dump rows separated by ','
 * }
 */
exports.writeJsonToCsv = async (obj, outputStream) => {
  if (obj.header) {
    const header = obj.header.join(",");
    await outputStream.write(`${header}\n`);
    for (row of obj.data) {
      const rowArr = obj.header.map((key) => row[key]);
      await outputStream.write(`${rowArr.join(",")}\n`);
    }
  } else {
    for (row of obj.data) {
      await outputStream.write(`${Object.values(row)}\n`);
    }
  }
  return true;
};
