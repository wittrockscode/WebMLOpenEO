import type { Feature, FeatureCollection } from "./geojson";
import { Feature as OLFeature } from "ol";

export type ModalHandler = {
  modal_id: import("vue").Ref<import("@/enums").ModalIds | null>;
  zIndex: import("vue").Ref<number>;
  cancelFn: () => void;
  submitFn: (identifyier?: number) => void;
  outerClickFn: () => void;
  open: (value?: any) => void;
  close: () => void;
  setPayload: (payload: SubmitPayload) => void;
  setZIndex: (zIndex: number) => void;
  onCancel: (callback: () => void) => void;
  onSubmit: (callback: (payload: SubmitPayload, identifyier: number) => void) => void;
  onOpen: (callback: (value?: any) => void) => void;
};

export type HyperParameter = {
  name: string;
  value: number;
};

export type SubmitPayload = null | string | Feature | FeatureCollection | File | Feature[] | HyperParameter[];

export type MapHandler = {
  changeMode: (mode: import("@/enums").MapModes) => void;
  reset: () => void;
  onReset: (callback: () => void) => void;
  deleteDrawFeatures: () => void;
  onDeleteDrawFeatures: (callback: () => void) => void;
  addFeatures: (features: OLFeature[]) => void;
  onFeaturesAdded: (callback: () => void) => void;
  setBaseTiff: (tiff: any) => void;
  onBaseTiffSet: (callback: () => void) => void;
  MAP_MODE: import("vue").Ref<import("@/enums").MapModes>;
  FEATURES: import("vue").Ref<OLFeature[]>;
  BASE_TIFF: import("vue").Ref<Blob | null>;
}