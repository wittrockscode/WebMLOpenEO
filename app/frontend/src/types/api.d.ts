import type { Polygon, FeatureCollection } from "@/types/geojson";

export declare namespace Request {
  namespace Classify {
    type Payload = {
      doi: Date;
      aoi: Polygon;
      td: FeatureCollection;
      hyperparameter: null;
      resolution: null;
    }
  }
}