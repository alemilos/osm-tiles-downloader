const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cliProgress = require("cli-progress");

const { Logger } = require("../models/Logger");
const { Generator } = require("./generator");

// Url to fetch from
const url_base = "https://tile.openstreetmap.org/";

let OUTPUT_DIRECTORY;

function main(bbox, zooms, output) {
  console.clear();

  // generate Patterns
  const patterns = Generator.generate_patterns(zooms, bbox);

  OUTPUT_DIRECTORY = output;

  const start_after = 10000; // Start the script after this amount of ms

  Logger.downloading_info(start_after, patterns.length); // Info before executing

  setTimeout(() => {
    makeRequests(patterns);
  }, start_after);
}

///////////////////////////////////////////////////
// A REQUEST AFTER THE OTHER
///////////////////////////////////////////////////

/**
 * Just a delay of ms
 * @param {*} ms
 * @returns
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Handle the requests one by one for downloading tiles, make sure to have a 50 ms timespan between each sent request
 * @param {*} patterns
 */
async function makeRequests(patterns) {
  let i = 0; // patterns of tiles downloaded
  let n = patterns.length; // patterns of tiles to download

  // Initialize the Progress Bar
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(n, i);

  // Iterate through the patterns and handle each request sequentially
  for (let i = 0; i < n; i++) {
    const current_pattern = patterns[i];
    const startedAt = Date.now();
    await handleRequest(current_pattern);
    // Measure the time taken for the request
    const elapsedTime = Date.now() - startedAt;
    // Calculate the remaining time to ensure at least 50ms between requests
    const remainingTime = Math.max(50 - elapsedTime, 0);
    // Delay if necessary to ensure a minimum of 50ms between requests
    await delay(remainingTime);

    bar.update(i + 1); // Update the progress bar on i increase
  }

  // Terminate the progress bar
  bar.stop();
  console.log("\n✅ Completed!");
  process.exit(0);
}

/**
 * Handle request and save the image in the filesystem at the output directory
 * @param {*} pattern
 */
async function handleRequest(pattern) {
  const [z, x, y] = pattern.split("/");
  const url_pattern = url_base + `${z}/${x}/${y}.png`;
  const folder_path = path.join(OUTPUT_DIRECTORY, z, x);
  const file_path = `${y}.png`;
  const error_path = path.join(OUTPUT_DIRECTORY, "errors.txt");

  // Create the folder if it doesn't exist
  if (!fs.existsSync(folder_path)) {
    fs.mkdirSync(folder_path, { recursive: true });
  }

  try {
    const response = await axios.get(url_pattern, {
      responseType: "arraybuffer",
    });
    const imageData = response.data;

    fs.writeFile(
      path.join(folder_path, file_path),
      imageData,
      "binary",
      (err) => {
        if (err) {
          console.log("❌ Error downloading ", url_pattern);
          fs.appendFile(error_path, pattern + "\n", (err) => {});
        }
      }
    );
  } catch (error) {
    console.log("❌ Error downloading ", url_pattern);
    fs.appendFile(error_path, pattern + "\n", (err) => {});
  }
}

module.exports = { main };
