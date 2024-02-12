import type { FeatureCollection, Feature, Polygon } from "../types/geojson";

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

export const convertToEPSG4326 = (feature: OLFeature) => {
  return new OLFeature(feature.getGeometry()?.clone().transform("EPSG:3857", "EPSG:4326"));
};

export const featureToOLFeature = (feature: Feature) => {
  const abc = new OLGeoJSON().readFeature(feature);
  return abc;
};

export const OLFeatureToFeature = (feature: OLFeature) => {
  return new OLGeoJSON().writeFeatureObject(feature) as Feature;
};

export const featuresToFeatureCollection = (features: Feature[]): FeatureCollection => {
  return {
    type: "FeatureCollection",
    features,
  };
};

export const validateGeoJsonFeaturePolygon = (feature: Feature<Polygon>) => {
    return {
      isFeatureType: assertEqual(feature.type, "Feature"),
      hasGeometry: assertExists(feature.geometry),
      isPolygon: assertEqual(feature.geometry.type, "Polygon"),
      hasCoordinates: assertBigger(feature.geometry.coordinates.length, 0),
      hasPoints: assertBigger(feature.geometry.coordinates[0]!.length, 0),
    };
};

export const validateGeoJsonFeatureCollection = (featureCollection: FeatureCollection<Polygon>) => {
  return {
    isFeatureCollectionType: assertEqual(featureCollection.type, "FeatureCollection"),
    hasFeatures: assertBigger(featureCollection.features.length, 0),
    hasValidFeatures: !featureCollection.features.reduce((acc, feature) => {
      return acc || Object.values(validateGeoJsonFeaturePolygon(feature)).some((v) => !v);
    }, false),
  };
};

const assertExists = <T>(a: T) => {
  if (a === undefined || a === null) return false;

  return true;
};

const assertEqual = <T>(a: T, b: T) => {
  if (!assertExists(a) || !assertExists(b)) return false;
  if (a !== b) return false;

  return true;
};

const assertBigger = (a: number, b: number) => {
  if (!assertExists(a) || !assertExists(b)) return false;
  if (a <= b) return false;

  return true;
};
