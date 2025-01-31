# OSM TILES DOWNLOADER

Osm Tiles Downloader allows you to download tiles in a given bounding box for your required zoom levels

## Installation of Tiles Downloader

Clone the repo, install packages with npm and create a symlink to access the script globally

```bash
git clone https://github.com/alemilos/osm-tiles-downloader.git
cd osm-tiles-downloader
npm i
sudo npm link
```

After linking, the script will be available globally using

```
tiles-download [options]
```

## Usage

### Download Tiles for a Custom Bounded Region with Specific Zoom Levels

To download tiles for a custom region (defined by the bounding box) and specific zoom levels, use the following command:

```bash
tiles-download --bbox lat_max,lng_max,lat_min,lng_min --zooms 0,1,2,3,4 --output output_directory
```

### Download Tiles with Custom Region and World Zoom Levels (Full Zooms Take Priority)

If you want to include both custom zoom levels and global zoom levels (where full zoom levels take priority), use:

```bash
tiles-download --bbox lat_max,lng_max,lat_min,lng_min --zooms 0,1,2,3,4 --full-zooms 0,1,2,3 --output output_directory
```

### Download Tiles for Specific Countries

You can also download tiles for a specific country by using its country code. Below are a few examples:

- For Italy (country code: it)

```bash
tiles-download --country-code it --zooms 0,1,2,3,4 --output output_directory
```

- For France (country code: fr )

```
tiles-download --country-code fr --full-zooms 0,1,2,3 --output output_directory
```

- For Argentina (country code: fr )

```
tiles-download --country-code ar --zooms 6,7,13,12  --full-zooms 0,1,2,3 --output output_directory
```
