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
    type Response = {
      model_id: string;
      classification: string;
      class_map: string[];
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

    type Response = Blob | { error: string};
  }

  namespace Demo {
    type Response = Object
  }

  namespace Model {
    type Response = ArrayBuffer;
  }
}
