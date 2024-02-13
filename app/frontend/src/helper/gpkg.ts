import { GeoPackageAPI } from "@ngageoint/geopackage";


export const convertGPKGToGeoJSON = async (gpkg: Uint8Array) => {
  const result = await GeoPackageAPI.open(gpkg);
  const tableName = result.getFeatureTables()[0];
  if (!tableName) return;

  return Array.from(result.iterateGeoJSONFeatures(tableName));
};
