# OSM TILES DOWNLOADER 

Osm Tiles Downloader allows you to download tiles in a given bounding box for your required zoom levels
It also provides a react app to test your map tiles with leaflet and react-leaflet

## Installation of Tiles Downloader 

Move into the generator directory and install the packages with npm, pnpm or yarn.

```bash
cd generator
npm i 
```

## Usage

```bash
node download-tiles.js --bbox lat_start,lng_start,lat_end,lng_end --zooms 0,1,2,3,4 --output output_directory
```
