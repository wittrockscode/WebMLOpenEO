import type { SubmitPayload } from "../types/handlers";
import type { FeatureCollection, Polygon, Feature } from "../types/geojson";


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
  if (payload.type === "Feature") {
    if (payload.geometry.type === "Polygon") return payload.geometry;
  } else if (payload.type === "FeatureCollection") {
    if (payload.features.length !== 1) return null;
    if (payload.features[0]!.geometry.type === "Polygon") return payload.features[0]!.geometry;
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
  if (payload.type === "Feature") {
    if (payload.geometry.type === "Polygon") return payload as Feature<Polygon>;
  } else if (payload.type === "FeatureCollection") {
    if (payload.features.length !== 1) return null;
    if (payload.features[0]!.geometry.type === "Polygon") return payload.features[0]! as Feature<Polygon>;
  }

  return null;
};