import type { Polygon, FeatureCollection } from "@/types/geojson";
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
      hyperparameters: HyperParameter[];
      resolution: 10 | 30 | 60;
    }
  }
}