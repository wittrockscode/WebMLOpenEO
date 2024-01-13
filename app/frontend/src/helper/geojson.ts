import type { SubmitPayload } from "../types/handlers";
import type { FeatureCollection, Polygon, Feature } from "../types/geojson";

import { GeoJSON as OLGeoJSON} from 'ol/format';
import { Feature as OLFeature } from "ol";

export const payloadToPolygon = async (payload: SubmitPayload): Promise<Polygon | null> => {
  if (!payload) return null;
  if (payload instanceof File) {
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target?.result === "string") {
          resolve(payloadToPolygon(JSON.parse(e.target?.result)));
        }

        resolve(null);
      };
      reader.readAsText(payload);
    });
  }
  if (payload instanceof Array) {
    if (payload.length === 0) return null;

    if (payload[0]!.geometry.type === "Polygon") return payload[0]!.geometry;
  } else {
    if (payload.type === "Feature") {
      if (payload.geometry.type === "Polygon") return payload.geometry;
    } else if (payload.type === "FeatureCollection") {
      if (payload.features.length !== 1) return null;
      if (payload.features[0]!.geometry.type === "Polygon") return payload.features[0]!.geometry;
    }
  }

  return null;
};

export const fileToFeatureCollection = async (file: File): Promise<FeatureCollection | null> => {
  if (!file) return null;
  if (file instanceof File) {
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const geojson_file_string = e.target?.result;
        if (!geojson_file_string) resolve(null);

        if (geojson_file_string && typeof geojson_file_string === "string") {
          const parsed = JSON.parse(geojson_file_string);
          if(parsed?.type === "FeatureCollection") resolve(parsed);

          resolve(null);
        }

        resolve(null);
      };
      reader.readAsText(file);
    });
  }

  return null;
};

export const payloadToPolygonFeature = async (payload: SubmitPayload): Promise<Feature<Polygon> | null> => {
  if (!payload) return null;
  if (payload instanceof File) {
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target?.result === "string") {
          resolve(payloadToPolygonFeature(JSON.parse(e.target?.result)));
        }

        resolve(null);
      };
      reader.readAsText(payload);
    });
  }
  if (payload instanceof Array) {
    if (payload.length !== 1) return null;

    return payload[0]! as Feature<Polygon>;
  } else {
    if (payload.type === "Feature") {
      if (payload.geometry.type === "Polygon") return payload as Feature<Polygon>;
    } else if (payload.type === "FeatureCollection") {
      if (payload.features.length !== 1) return null;
      if (payload.features[0]!.geometry.type === "Polygon") return payload.features[0]! as Feature<Polygon>;
    }
  }

  return null;
};

export const payloadToFeatureCollection = async (payload: SubmitPayload): Promise<FeatureCollection | null> => {
  if (!payload) return null;
  if (payload instanceof File) {
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target?.result === "string") {
          resolve(payloadToFeatureCollection(JSON.parse(e.target?.result)));
        }

        resolve(null);
      };
      reader.readAsText(payload);
    });
  }
  if (payload instanceof Array) return null;
  else {
    if (payload.type === "Feature") return null;
    else if (payload.type === "FeatureCollection") return payload;
  }

  return null;
};

export const geoJsonFileToFeatures = async (file: File): Promise<Feature[] | null> => {

  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target?.result && typeof e.target?.result === "string") {
          const features = new OLGeoJSON().readFeatures(JSON.parse(e.target?.result)) as unknown;
          resolve(features as Feature[]);
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
