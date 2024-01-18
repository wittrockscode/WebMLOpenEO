/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Polygon, FeatureCollection, Feature } from "@/types/geojson";
import type { HyperParameter } from "./AppTypes";

export namespace Req {
  namespace Classify {
    type Payload = {
      model: "RandomForest";
      toi: {
        start_date: Date;
        end_date: Date;
      };
      aoi: Polygon;
      training_data: FeatureCollection;
      tot: {
        start_date: Date;
        end_date: Date;
      };
      hyperparameters: HyperParameter[];
      resolution: 10 | 30 | 60;
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

    type Response = {
      data: Blob;
      error: string;
    };
  }
}
