/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Polygon, FeatureCollection, Feature } from "@/types/geojson";
import type { HyperParameter } from "./AppTypes";

export namespace Req {
  namespace Classify {
    type Payload = {
      model: "RandomForest";
      TOI: {
        start_date: string;
        end_date: string;
      };
      AOI: {
        geometry: Polygon;
      };
      Training_Data: FeatureCollection;
      tot: {
        start_date: string;
        end_date: string;
      };
      Hyperparameter: HyperParameter[];
      Resolution: 10 | 30 | 60;
    };
  }

  namespace Sentinel {
    type Payload = {
      AOI: {
        geometry: Polygon;
      };
      TOI: {
        start_date: string;
        end_date: string;
      };
    };

    type Response = Blob;
  }
}
