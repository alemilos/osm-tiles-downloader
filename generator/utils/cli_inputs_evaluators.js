const fs = require("fs");
const path = require("path");

const checkBbox = (bbox) => {
  const bboxValues = bbox.split(",");

  try {
    // Check there are four inputs
    if (bboxValues.length !== 4) {
      throw new Error(
        "❌ bbox must receive 4 floats arguments separated by commas, make sure there are no spaces between commas."
      );
    }

    // Check inputs are floats
    bboxValues.map((val) => {
      const parseAttempt = parseFloat(val);
      if (!parseAttempt) {
        throw new Error(
          "❌ bbox must receive 4 floats arguments separated by commas, make sure there are no spaces between commas."
        );
      }
    });

    return { ok: true, bbox: bboxValues };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

const checkZooms = (zooms) => {
  const acceptedValues = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  ];

  try {
    // Check if zoom is only one
    if (String(zooms).length === 1) {
      return { ok: true, zooms: [parseInt(zooms)] };
    }

    // Extract input zooms and parse them to integers
    let zoomValues = zooms.split(",").map((val) => parseInt(val));

    // Filter repetitions
    zoomValues = zoomValues.filter(
      (value, index, self) => self.indexOf(value) === index
    );

    for (let zoomVal of zoomValues) {
      if (!acceptedValues.includes(zoomVal)) {
        let errorMessage = `❌ Accepted zoom levels are between ${
          acceptedValues[0]
        } and ${
          acceptedValues[acceptedValues.length - 1]
        }, \nℹ️  received: ${zoomVal}`;
        throw new Error(errorMessage);
      }
    }

    return { ok: true, zooms: zoomValues };
  } catch (err) {
    if (err.message === "zooms.split is not a function") {
      return {
        ok: false,
        error:
          `❌ zooms requires comma separated zoom levels between ${
            acceptedValues[0]
          } and ${acceptedValues[acceptedValues.length - 1]}, \nℹ️ received: ` +
          zooms,
      };
    }
    return { ok: false, error: err.message };
  }
};

const checkOutput = (output) => {
  let directoryDoesntExist = false;
  const filePath = path.join("..", "tiles_downloads", output);
  try {
    fs.readdirSync(filePath, (err) => {
      if (err.errno === -2) {
        // The Directory doesn't exist
        directoryDoesntExist = true;
      }
    });

    if (directoryDoesntExist) {
      return { ok: true, output: output };
    } else {
      return { ok: false, error: "❌ Output Directory already exists" };
    }
  } catch (err) {
    if (err.errno === -2) {
      // The Directory doesn't exist
      // so we can proceed safely
      return { ok: true, output: output };
    }
    return { ok: false, error: "Fatal Error" };
  }
};

module.exports = {
  checkBbox,
  checkZooms,
  checkOutput,
};
