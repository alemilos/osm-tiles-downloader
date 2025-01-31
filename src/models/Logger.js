const { countries } = require("../data/countries");

const Logger = {
  /**
   * Help log when nothing is specified or when --help is passed in args
   */
  help() {
    console.log(`
Usage: tiles-download [options]
    
Options:

 --help          Show help information  

 --example       Show an example of how to run the script  

 --url           Show the URL used by the script  

 --bbox          Define a bounding box with four comma-separated coordinates:  
                 LAT MAX, LNG MAX, LAT MIN, LNG MIN 
                 Basically the North West and South East points that defines the bounding box   
                 (e.g. 21.099875,-110.537651,-58.736856,-27.513502 or "21.099875, -110.537651, -58.736856, -27.513502)

 --zooms         (required) Specify zoom levels as a comma-separated list in the range (0-16)
                 (e.g. 1,5,7,8 will download tiles at zoom levels 1,5,7,8)  

 --output        (required) Set the output directory for downloaded tiles         

 --country-code  If specified, automatically use the bounding box of the given country code.
                 When this is specified, --bbox is not required. 

 --full-zooms    Specify zoom levels for which all world tiles should be downloaded 
                 (e.g. 0,1,2,3,4,5 will download all the tiles for the whole map at these specified zoom levels.
                 If other zooms are specified in --zooms, they will be downloaded only for the bounding box specified at --bbox)
    `);

    process.exit(0);
  },

  /**
   * An example log on how to use this script
   */
  example() {
    console.log(`
Example usage of the script for a custom border box 

  tiles-download --bbox 21.099875,-110.537651,-58.736856,-27.513502 --zooms 0,1,2,3,4,5 --output output_dir
  # this will download the tiles for the specified zoom levels (0,1,2,3,4,5) in the region specified in --bbox,

Example usage of the script for a specific country 

  tiles-download -country-code it --zooms 5,6,7 --full-zooms 0,1,2,3,4 --output output_dir
  # this will download the tiles for Italy 🇮🇹  for the zooms 5,6,7 and the whole world tiles for the zooms 0,1,2,3,4

      `);
    process.exit(0);
  },

  url() {
    console.log(`
The URL used to fetch tiles is: https://tile.openstreetmap.org/{z}/{x}/{y}.png\n
  - z represents the zoom level\n
  - x represents the horizontal cooardinate of the tile\n
  - y represents the vertical cooardinate of the tile\n`);
    process.exit(0);
  },

  missing_fields() {
    console.log(
      `\n❌ Either provide (--bbox or --country-code), (--zooms or --full-zooms) and --output\n`
    );
    process.exit(0);
  },

  invalid_bbox() {
    console.error(
      "❌ bbox must receive 4 floats arguments separated by commas (and no whitespaces)"
    );
    process.exit(0);
  },

  invalid_zooms() {
    console.error(
      `❌ zooms must receive comma separated integers in range 0,16`
    );
    process.exit(0);
  },

  invalid_full_zooms() {
    console.error(
      `❌ full-zooms must receive comma separated integers in range 0,7`
    );
    process.exit(0);
  },

  invalid_country_code() {
    console.log(`\n❌ Please provide one of these country codes: 
${Object.keys(countries)}
`);
    process.exit(0);
  },

  invalid_output() {
    console.log(`\n❌ Please provide a valid output directory\n`);
    process.exit(0);
  },

  _expected_mb_usage(patterns_length) {
    const min_kb = 5;
    const max_kb = 30;

    const min_mem_mb = ((min_kb * patterns_length) / 1000).toFixed(2);
    const max_mem_mb = ((max_kb * patterns_length) / 1000).toFixed(2);

    return [min_mem_mb, max_mem_mb];
  },

  downloading_info(start_after, patterns_length) {
    const [mem_usage_min, mem_usage_max] =
      this._expected_mb_usage(patterns_length);

    // Show infos...
    console.log(`
🏁 Starting in ${start_after / 1000} seconds...
🗾 Number of Png to download: ${patterns_length}
💿 Mem usage will be around [${mem_usage_min}-${mem_usage_max}] Mb\n`);
  },
};

module.exports = { Logger };
