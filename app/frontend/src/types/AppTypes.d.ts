import type { Feature, FeatureCollection, Polygon } from "./geojson";


export type HyperParameter = {
  name: string;
  value: number;
};

export type Nullable<T> = T | null;


export type AoiModalPayload = {
  aoi: Feature<Polygon>;
  toi: Date[];
  withFile: boolean;
  fileName: string;
};

export type TdModalPayload = {
  td: FeatureCollection;
  tot: Date[];
  withFile: boolean;
  fileName: string;
};

export type HyperParameterModalPayload = HyperParameter[];