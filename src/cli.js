#!/usr/bin/env node

const args = require("minimist")(process.argv.slice(2));

// Evaluators
const {
  parseBoundingBox,
  parseCountryCode,
  parseZooms,
  parseOutput,
  parseAndMergeZoomsFullZooms,
  zoomsString,
} = require("./utils/parsers");

const { main } = require("./utils/main");
const { Logger } = require("./models/Logger");

// Values to send to the main program
let OUTPUT, OUTPUT_EXISTS;
let ZOOMS, FULL_ZOOMS;
let BBOX, COUNTRY_NAME;

// If no inputs are provided, display the helper
if (Object.keys(args).length === 1 || args.help) {
  Logger.help();
}

if (args.example) {
  Logger.example();
}

if (args.url) {
  Logger.url();
}

// Retrieve BBOX
if (args.bbox) {
  try {
    const bbox = parseBoundingBox(args.bbox);
    BBOX = bbox;
  } catch (err) {
    Logger.invalid_bbox();
  }
}

// Retrieve zoom levels
if (args.zooms) {
  try {
    const zooms = parseZooms(args.zooms, 16);
    ZOOMS = zooms;
  } catch (err) {
    Logger.invalid_zooms();
  }
}

if (args["full-zooms"]) {
  try {
    const zooms = parseZooms(args["full-zooms"], 7);
    FULL_ZOOMS = zooms;
  } catch (err) {
    Logger.invalid_full_zooms();
  }
}

if (args["country-code"]) {
  try {
    const [code, countryName] = parseCountryCode(args["country-code"]);
    BBOX = code;
    COUNTRY_NAME = countryName;
  } catch (err) {
    Logger.invalid_country_code();
  }
}

// Retrieve output directory
if (args.output) {
  try {
    OUTPUT_EXISTS = parseOutput(args.output);
    OUTPUT = args.output;
  } catch (err) {
    Logger.invalid_output();
  }
}

// Missing fields
if (
  (!args.bbox && !args["country-code"]) ||
  (!args.zooms && !args["full-zooms"]) ||
  !args.output
) {
  Logger.missing_fields();
}

// After all arguments are checked, see if there are all necessary inputs
if ((BBOX, ZOOMS || FULL_ZOOMS, OUTPUT)) {
  const parsedZooms = parseAndMergeZoomsFullZooms(ZOOMS, FULL_ZOOMS);

  console.log(`
  Proceed with following inputs?

    --bbox   ${BBOX} ${
    COUNTRY_NAME ? `(${COUNTRY_NAME})` : ""
  }\n                                                
    --zooms ${zoomsString(parsedZooms)}

    --output ${OUTPUT} ${OUTPUT_EXISTS ? "( ❗️ already exists )" : ""}
                                                                    
  `);

  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Accept user input to Continue or Abort
  readline.question(` ❓ yes / no: `, (res) => {
    if (
      res === "y" ||
      res === "yes" ||
      res === "1" ||
      res === "" ||
      res === "\n"
    ) {
      main(BBOX, parsedZooms, OUTPUT);
    } else {
      console.log("\n 🛑 Stopped\n");
      process.exit(0);
    }
  });
}
