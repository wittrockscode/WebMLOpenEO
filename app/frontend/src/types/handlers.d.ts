import type { Feature, FeatureCollection } from "./geojson";
import { Feature as OLFeature } from "ol";

export type ModalHandler = {
  modal_id: import("vue").Ref<import("@/enums").ModalIds | null>;
  cancelFn: () => void;
  submitFn: (identifyier?: number) => void;
  outerClickFn: () => void;
  open: () => void;
  close: () => void;
  setPayload: (payload: SubmitPayload) => void;
  onCancel: (callback: () => void) => void;
  onSubmit: (callback: (payload: SubmitPayload, identifyier: number) => void) => void;
  onOpen: (callback: () => void) => void;
};

export type SubmitPayload = null | Feature | FeatureCollection | File | Feature[];

export type MapHandler = {
  changeMode: (mode: import("@/enums").MapModes) => void;
  reset: () => void;
  onReset: (callback: () => void) => void;
  deleteDrawFeatures: () => void;
  onDeleteDrawFeatures: (callback: () => void) => void;
  addFeatures: (features: OLFeature[]) => void;
  onFeaturesAdded: (callback: () => void) => void;
  MAP_MODE: import("vue").Ref<import("@/enums").MapModes>;
  FEATURES: import("vue").Ref<OLFeature[]>;
}