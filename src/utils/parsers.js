const fs = require("fs");
const { countries } = require("../data/countries");

/**
 * Parse the input bbox ensuring they are 4 numbers that can be parsed to floats.
 * If the bbox are not well formed, return false, else return the bbox
 * @param {*} bbox bbox or false
 * @returns
 */
const parseBoundingBox = (bbox) => {
  let bboxValues = bbox.split(",");
  let invalidBBox = false;

  if (bboxValues.length !== 4) {
    throw new Error();
  }

  // Map bbox values to floats
  bboxValues = bboxValues.map((val) => {
    let floatBBox;
    try {
      floatBBox = parseFloat(val);
      if (isNaN(floatBBox)) throw new Error();
    } catch (err) {
      invalidBBox = true;
    }

    return floatBBox;
  });

  if (invalidBBox) throw new Error();

  return bboxValues;
};

/**
 * Parse the zooms ensuring they are comma separated integers.
 * If they are not well formed, return false else return the zooms
 * @param {*} zooms
 * @param {number} max the max accepted zoom level
 * @returns zooms or false
 */
const parseZooms = (zooms, max = 7) => {
  const minAcceptedZoom = 0;
  const maxAcceptedZoom = max; // 7 for full world tiles, 16 for bounded ones
  // altough 18 is the max zoom for leaflet, this causes stack overflow issues and would probably give issues on download (for full world tiles it is much worse)

  let invalidZooms;

  if (zooms === true) {
    throw new Error();
  }

  // There is only one zoom
  if (typeof zooms === "number") {
    return [zooms];
  }

  let splitted = zooms.split(",");

  // Map zoom to integers
  const zoomValues = splitted.map((zoom) => {
    try {
      zoom = parseInt(zoom);
      if (zoom < minAcceptedZoom || zoom > maxAcceptedZoom) throw new Error(); // out of range zoom
      if (isNaN(zoom)) throw new Error();
    } catch (err) {
      invalidZooms = true;
    }

    return zoom;
  });

  if (invalidZooms) throw new Error();

  return zoomValues;
};

/**
 * Check if country code is valid, in case generate the bounding box for that country and return it.
 * If the country code is not valid, return false
 * @param {*} cc the country code
 * @returns the bounding box for that country
 */
function parseCountryCode(cc) {
  if (!(typeof cc === "string")) {
    throw new Error();
  }

  if (countries[cc.toUpperCase()]) {
    // Valid country code
    // Example
    // "IT": ["Italy", [6.75, 36.62, 18.48, 47.12]]
    // 6.75°E (Westernmost longitude)
    // 36.62°N (Southernmost latitude)
    // 18.48°E (Easternmost longitude)
    // 47.12°N (Northernmost latitude)

    const countryName = countries[cc.toUpperCase()][0];
    const bbox = countries[cc.toUpperCase()][1];
    // I need to have lat max, lng max, lat min, lng min bbox
    const correctBbox = [bbox[3], bbox[0], bbox[1], bbox[2]];
    return [correctBbox, countryName];
  } else {
    throw new Error();
  }
}

/**
 * Check if output directory exists
 * @param {*} output
 * @returns
 */
function parseOutput(output) {
  if (typeof output === "boolean") throw new Error();
  return fs.existsSync(output);
}

/**
 * If both zooms and full zooms are provided, parse and merge both of them.
 * Else just parse them to a specific format which is
 * {[zoomLevel]: true/false} where true or false is wether that zoom level should download or not world tiles
 *
 * @param {*} zooms
 * @param {*} zoomsFull
 */
function parseAndMergeZoomsFullZooms(zooms, fullZooms) {
  let parsedZooms = {};

  if (zooms && fullZooms) {
    // Both provided, full-zooms will be true and zooms false
    zooms.forEach((zoom) => {
      parsedZooms[zoom] = false;
    });
    // Overwrite the normal zoom configuration
    fullZooms.forEach((zoom) => {
      parsedZooms[zoom] = true;
    });
  } else if (zooms && !fullZooms) {
    zooms.forEach((zoom) => {
      parsedZooms[zoom] = false;
    });
  } else if (!zooms && fullZooms) {
    fullZooms.forEach((zoom) => {
      parsedZooms[zoom] = true;
    });
  }

  return parsedZooms;
}

/**
 * Convert the parsed zooms to a string to display to the user
 * @param {*} zooms
 * @returns
 */
function zoomsString(zooms) {
  let string = " ";
  Object.keys(zooms).forEach((zoom) => {
    if (zooms[zoom]) {
      // it is a full zoom
      string += `${zoom} (full) `;
    } else {
      // it is not a full zoom
      string += `${zoom} (bounded) `;
    }
  });

  return string;
}

module.exports = {
  parseBoundingBox,
  parseZooms,
  parseOutput,
  parseCountryCode,
  parseAndMergeZoomsFullZooms,
  zoomsString,
};
