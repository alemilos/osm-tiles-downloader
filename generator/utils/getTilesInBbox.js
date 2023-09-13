const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cliProgress = require("cli-progress");
const { log_info } = require("./logger");
const { fromNodeToPython } = require("./script");

// Url to fetch from
const url_base = "https://tile.openstreetmap.org/";

let OUTPUT_DIRECTORY;

function main(bbox, zooms, output) {
  console.clear();
  // generate Patterns
  const patterns = generate_patterns(zooms, bbox);
  // console.log(patterns);
  // console.log();

  // set global variables to keep code unchanged
  OUTPUT_DIRECTORY = output;

  // Execute the Script after 5 seconds to show information of the request.
  const start_after = 10000;

  // Show info before executing the script
  log_info(start_after, patterns.length);

  // Execute the script
  setTimeout(() => {
    exe(patterns);
  }, start_after);
}

function exe(patterns) {
  let i = 0; // patterns of tiles downloaded
  let n = patterns.length; // patterns of tiles to download
  let milliseconds = 50; // time between each PNG request
  // NOTE: if milliseconds is too low (such as 4ms), when downloading in high zoom level (from 8 to 19)
  // There will be a problem since there are too many request for different zones at once.
  // Increasing Milliseconds could solve the issue.
  // 100 is ok until level 9 of zoom.

  // Initialize the Progress Bar
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(n, i);

  // Create interval to make request on
  let interval = setInterval(() => {
    // Update the progress bar on i increase
    bar.update(i);

    if (i < n) {
      const current_pattern = patterns[i];
      handleRequest(current_pattern);

      i++;
    } else {
      // terminate the progress bar
      bar.stop();
      clearInterval(interval);
      console.log("\n✅ Completed!");
      process.exit(0);
    }
  }, milliseconds);
}

async function handleRequest(pattern) {
  const [z, x, y] = pattern.split("/");
  const url_pattern = url_base + `${z}/${x}/${y}.png`;
  const folder_path = path.join(
    "..",
    "tiles_downloads",
    OUTPUT_DIRECTORY,
    z,
    x
  );
  const file_path = `${y}.png`;
  const error_path = path.join(
    "..",
    "tiles_downloads",
    OUTPUT_DIRECTORY,
    "errors.txt"
  );

  // Create the folder if it doesn't exist
  if (!fs.existsSync(folder_path)) {
    fs.mkdirSync(folder_path, { recursive: true });
  }

  axios
    .get(url_pattern, { responseType: "arraybuffer" })
    .then((response) => {
      const imageData = response.data;
      fs.writeFile(
        path.join(folder_path, file_path),
        imageData,
        "binary",
        (err) => {
          if (err) {
            console.log("❌ Error downloading ", pattern);
            fs.appendFile(error_path, pattern + "\n", (err) => {});
          }
        }
      );
    })
    .catch((error) => {
      console.log("❌ Error downloading ", pattern);
      fs.appendFile(error_path, pattern + "\n", (err) => {});
    });
}

function generate_zxy_combinations(bbox, zoom) {
  const res = fromNodeToPython(bbox, zoom);
  const [NW, NE, SW, SE] = res;

  // console.log(`NW: [${NW}] NE: [${NE}] \nSW: [${SW}] SE: [${SE}]`);

  let zxy_combinations = [];
  for (let y = NW[1]; y <= SE[1]; y++) {
    for (let x = NW[0]; x <= SE[0]; x++) {
      zxy_combinations.push(`${zoom}/${x}/${y}`);
    }
  }

  return zxy_combinations;
}

function generate_patterns(zooms, bbox) {
  const patterns = [];
  for (let zoom of zooms) {
    const zxy_combinations = generate_zxy_combinations(bbox, zoom);
    patterns.push(...zxy_combinations);
  }
  return patterns;
}

module.exports = { main };
