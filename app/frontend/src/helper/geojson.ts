import type { FeatureCollection, Feature } from "../types/geojson";

import { GeoJSON as OLGeoJSON} from 'ol/format';
import { Feature as OLFeature } from "ol";

export const geoJsonFileToFeatures = async (file: File): Promise<Feature[] | null> => {

  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target?.result && typeof e.target?.result === "string") {
          const data = JSON.parse(e.target?.result);
          if (data.type === "FeatureCollection") {
            resolve(data.features as Feature[]);
          } else if (data.type === "Feature") {
            resolve([data]);
          }
        }
      } finally {
        resolve(null);
      }
    };
    reader.readAsText(file);
  });
};

export const geoJsonFileToFeatureCollection = async (file: File): Promise<FeatureCollection | null> => {
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target?.result && typeof e.target?.result === "string") {
          const data = JSON.parse(e.target?.result);
          if (data.type === "FeatureCollection") {
            resolve(data);
          } else if (data.type === "Feature") {
            resolve({ type: "FeatureCollection", features: [data as Feature] });
          }
        }
      } finally {
        resolve(null);
      }
    };
    reader.readAsText(file);
  });
};

export const convertToEPSG3857 = (feature: OLFeature) => {
  return new OLFeature(feature.getGeometry()?.clone().transform("EPSG:4326", "EPSG:3857"));
};

export const featureToOLFeature = (feature: Feature) => {
  const abc = new OLGeoJSON().readFeature(feature);
  return abc;
};

export const OLFeatureToFeature = (feature: OLFeature) => {
  return new OLGeoJSON().writeFeatureObject(feature) as Feature;
};
