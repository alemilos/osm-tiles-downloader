## OSM Tiles Downloader – Detailed Guide

The `osm-tiles-downloader` tool allows you to download map tiles for offline usage based on a geographic area and zoom levels.

---

### Installation

Clone the repository, install dependencies, and link the CLI globally:

```bash
git clone https://github.com/alemilos/osm-tiles-downloader.git
cd osm-tiles-downloader
npm install
sudo npm link
```

After linking, the command will be available globally:

```bash
tiles-download [options]
```

---

### Basic Usage

#### Download Tiles for a Custom Bounding Box

```bash
tiles-download --bbox="lat_max,lng_max,lat_min,lng_min" --zooms 0,1,2,3,4 --output output_directory
```

#### Download Tiles with Global Zoom Levels

```bash
tiles-download --bbox="lat_max,lng_max,lat_min,lng_min" --zooms 4,5,6 --full-zooms 0,1,2,3 --output output_directory
```

- `--full-zooms` downloads **entire world tiles** for specified zoom levels
- `--zooms` applies only to the defined bounding box

#### Download Tiles by Country Code

```bash
tiles-download --country-code it --zooms 0,1,2,3,4 --output output_directory
```

When using `--country-code`, the bounding box is automatically determined.

---

### Options Reference

#### `--help`

Displays the help message and exits.

#### `--example`

Shows a usage example for quick reference.

#### `--url`

Displays the tile server URL used by the script.

---

#### `--bbox`

Defines the geographic bounding box using four comma-separated values:

```
LAT_MAX, LNG_MAX, LAT_MIN, LNG_MIN
```

- Represents the **north-west** and **south-east** corners
- Example:

```bash
--bbox="21.099875,-110.537651,-58.736856,-27.513502"
```

Notes:

- Spaces are allowed but optional
- Required unless `--country-code` is used

---

#### `--zooms` (required)

Specifies which zoom levels to download.

```bash
--zooms 1,5,7,8
```

- Valid range: `0–18`
- Higher zoom = more detail = significantly more tiles

---

#### `--output` (required)

Defines the directory where tiles will be saved.

```bash
--output ./tiles
```

Make sure:

- The directory exists or is writable
- You have enough disk space

---

#### `--country-code`

Uses a predefined bounding box based on a country.

```bash
--country-code it
```

- Replaces the need for `--bbox`
- Uses standard ISO country codes (e.g. `it`, `fr`, `ar`)

---

#### `--full-zooms`

Specifies zoom levels for which **all world tiles** should be downloaded.

```bash
--full-zooms 0,1,2,3
```

Behavior:

- Downloads the entire world for these zoom levels
- If combined with `--zooms`, those zooms apply only to the bounding box

---

### Important Notes

- Tile downloads can become extremely large at high zoom levels
- Always test with a small area and low zooms first
- Combining `--full-zooms` with high zoom levels can consume significant storage
- Ensure stable internet connection during download

---

### Recommended Workflow

1. Start with low zoom levels (e.g. `0–5`) to validate setup
2. Gradually increase zoom levels based on needs
3. Limit bounding box size to reduce download volume
4. Verify tiles before integrating into the application

---
