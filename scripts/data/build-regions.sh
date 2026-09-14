#!/usr/bin/env bash
# Builds the region boundary layer by dissolving the county boundaries
# (data/boundaries/service-area-counties.geojson) on the county->region
# crosswalk in regions-crosswalk.csv (sourced from HR&A's
# "MHM County_Region Crosswalk.csv", with "De Witt" normalized to "DeWitt"
# to match the shapefile's CNTY_NM spelling).
#
# Requires mapshaper (npx --yes mapshaper, or npm install -g mapshaper).
#
# Usage:
#   ./scripts/data/build-regions.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

COUNTIES="$ROOT_DIR/data/boundaries/service-area-counties.geojson"
CROSSWALK="$SCRIPT_DIR/regions-crosswalk.csv"
OUT_GEOJSON="$ROOT_DIR/data/boundaries/service-area-regions.geojson"
OUT_SHAPEFILE="$ROOT_DIR/data/raw/service-area-regions.shp"

if [ ! -f "$COUNTIES" ]; then
  echo "Missing $COUNTIES — run convert.sh on service-area-counties.shp first." >&2
  exit 1
fi

mkdir -p "$(dirname "$OUT_GEOJSON")" "$(dirname "$OUT_SHAPEFILE")"

npx --yes mapshaper "$COUNTIES" \
  -join "$CROSSWALK" keys=CNTY_NM,CNTY_NM \
  -dissolve REGION \
  -o "$OUT_GEOJSON" format=geojson precision=0.000001 force

npx --yes mapshaper "$OUT_GEOJSON" \
  -o "$OUT_SHAPEFILE" format=shapefile force

echo "Wrote $OUT_GEOJSON"
echo "Wrote $OUT_SHAPEFILE (+ .dbf/.shx/.prj)"
