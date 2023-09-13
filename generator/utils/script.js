const { execSync } = require("child_process");

function fromNodeToPython(bbox, zoom) {
  // Run the Python script
  const command = `python ./utils/lat_lng_utils.py ${bbox} ${zoom}`;

  // Output from python script
  const output = execSync(command);

  // String output
  const outputData = output.toString().trim();

  // Convert the string output to lists for NW, ..., SE
  const stringArray = outputData.replace(/\[|\]/g, "").split(" ");
  const NW = [parseInt(stringArray[0]), parseInt(stringArray[1])];
  const NE = [parseInt(stringArray[2]), parseInt(stringArray[3])];
  const SW = [parseInt(stringArray[4]), parseInt(stringArray[5])];
  const SE = [parseInt(stringArray[6]), parseInt(stringArray[7])];

  return [NW, NE, SW, SE];
}

module.exports = { fromNodeToPython };
