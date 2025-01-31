const Generator = {
  /**
   * Convert lat/lng to a tile [x,y] position
   * @param {*} lat_deg
   * @param {*} lon_deg
   * @param {*} zoom
   * @returns
   */
  _deg2num(lat_deg, lon_deg, zoom) {
    const lat_rad = lat_deg * (Math.PI / 180);
    const n = 1 << zoom;
    const xtile = Math.floor(((lon_deg + 180.0) / 360.0) * n);
    const ytile = Math.floor(
      ((1.0 - Math.asinh(Math.tan(lat_rad)) / Math.PI) / 2.0) * n
    );
    return [xtile, ytile];
  },

  /**
   * Generate bounded tiles z/x/y combinations
   * @param {*} bbox
   * @param {*} zoom
   * @returns
   */
  _generate_bounded_zxy_combinations(bbox, zoom) {
    let [latStart, lngStart, latEnd, lngEnd] = bbox;
    latStart = parseFloat(latStart);
    lngStart = parseFloat(lngStart);
    latEnd = parseFloat(latEnd);
    lngEnd = parseFloat(lngEnd);

    const NW = this._deg2num(latStart, lngStart, zoom);
    // const NE = deg2num(latStart, lngEnd, zoom); // not required
    // const SW = deg2num(latEnd, lngStart, zoom); // not required
    const SE = this._deg2num(latEnd, lngEnd, zoom);

    let zxy_combinations = [];
    for (let y = NW[1]; y <= SE[1]; y++) {
      for (let x = NW[0]; x <= SE[0]; x++) {
        zxy_combinations.push(`${zoom}/${x}/${y}`);
      }
    }

    return zxy_combinations;
  },

  /**
   * Generate world z/x/y tile combinations relative to the zoom level
   * @param {*} zoom
   * @returns
   */
  _generate_full_zxy_combinations(zoom) {
    const worldSize = Math.pow(2, zoom); // Number of tiles in one direction (x or y)

    let zxy_combinations = [];

    // Loop through all tile x and y values for the given zoom level
    for (let y = 0; y < worldSize; y++) {
      for (let x = 0; x < worldSize; x++) {
        zxy_combinations.push(`${zoom}/${x}/${y}`);
      }
    }

    return zxy_combinations;
  },

  /**
   * Generate the patterns to be sent to the server z/x/y for both full and bounded zoom levels.
   * @param {*} zooms
   * @param {*} bbox
   * @returns
   */
  generate_patterns(zooms, bbox) {
    let patterns = [];

    Object.keys(zooms).forEach((zoom) => {
      if (zooms[zoom]) {
        // If the zoom is true it means it is a full zoom, else a localized (bounded) zoom
        const fullCombinations = this._generate_full_zxy_combinations(zoom);
        patterns = patterns.concat(fullCombinations);
      } else {
        const boundedCombinations = this._generate_bounded_zxy_combinations(
          bbox,
          zoom
        );
        patterns = patterns.concat(boundedCombinations);
      }
    });

    return patterns;
  },
};

module.exports = { Generator };
