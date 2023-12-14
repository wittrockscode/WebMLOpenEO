import type { Polygon, FeatureCollection, Feature } from "@/types/geojson";

export namespace Req {
  namespace Classify {
    type Payload = {
      doi: Date;
      aoi: Polygon;
      td: FeatureCollection;
      hyperparameter: null;
      resolution: null;
    }
  }

  export namespace PreRelease {
    type Payload = Feature<Polygon>;
  }
}