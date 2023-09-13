const args = require("minimist")(process.argv.slice(2));

// Evaluators
const {
  checkBbox,
  checkZooms,
  checkOutput,
} = require("./utils/cli_inputs_evaluators");
const { main } = require("./utils/getTilesInBbox");

// FINAL VALUES to send to program
let OUTPUT;
let ZOOMS;
let BBOX;

// If no inputs are provided, display the helper
if (Object.keys(args).length === 1) {
  args.help = true;
}

// Helper
if (args.help) {
  console.log();
  console.log("Usage: node download-tiles.js [options]");
  console.log("Options:");
  console.log("  --help      Display help information");
  console.log("  --example   Display an example to run the script");
  console.log("  --url       Display the url used by the script");
  console.log(
    "  --bbox      4 Comma-separated bbox coords:  latStart, lngStart, latEnd, lngEnd    (required)"
  );
  console.log(
    "  --zooms     Comma-separated zoom levels between 0 and 18                          (required)"
  );
  console.log(
    "  --output    Output directory for downloaded tiles                                 (required)"
  );
  process.exit(0);
}

if (args.example) {
  console.log();
  console.log("Example Usage of the script for South America");
  console.log(
    "node download-tiles.js --bbox 21.099875,-110.537651,-58.736856,-27.513502 --zooms 0,1,2,3,4,5 --output tiles_downloads "
  );

  process.exit(0);
}

if (args.url) {
  console.log();
  console.log(
    "The URL used to fetch tiles is: https://tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  console.log("- z represents the zoom level");
  console.log("- x represents the horizontal cooardinate of the tile");
  console.log("- y represents the vertical cooardinate of the tile");
  process.exit(0);
}

// Retrieve BBOX
if (args.bbox) {
  const _checkBbox = checkBbox(args.bbox);
  if (!_checkBbox.ok) {
    console.log(_checkBbox.error);
    process.exit(0);
  } else {
    BBOX = _checkBbox.bbox;
  }
}

// Retrieve zoom levels
if (args.zooms) {
  const _checkZooms = checkZooms(args.zooms);
  if (!_checkZooms.ok) {
    console.log(_checkZooms.error);
    process.exit(0);
  } else {
    ZOOMS = _checkZooms.zooms;
  }
}

// Retrieve output directory
if (args.output) {
  const _checkOutput = checkOutput(args.output);
  if (!_checkOutput.ok) {
    console.log(_checkOutput.error);
    process.exit(0);
  } else {
    OUTPUT = _checkOutput.output;
  }
}

if (!args.bbox || !args.zooms || !args.output) {
  console.log();
  console.log("Please Provide --bbox, --zooms, --output");
  args.help = true;
}
// After all arguments are checked, see if there are all necessary inputs
if ((BBOX, ZOOMS, OUTPUT)) {
  console.log();
  console.log("Proceed with following inputs?\n ");
  console.log("--bbox   ", BBOX);
  console.log("--zooms  ", ZOOMS);
  console.log("--output ", OUTPUT);

  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Accept user input to Continue or Abort
  readline.question("y/n\t", (res) => {
    if (res === "y" || res === "yes" || res === "1") {
      console.clear();
      console.log("✅ Proceding...");
      main(BBOX, ZOOMS, OUTPUT);
    } else {
      console.log("🛑 Stopped");
      process.exit(0);
    }
  });
}
