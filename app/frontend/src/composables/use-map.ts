import { ref, type Ref } from "vue";
import { MapModes } from "@/enums";
import type { MapHandler } from "@/types/handlers";
import Feature from "ol/Feature";
import { convertToEPSG3857 } from "@/helper/geojson";


export const useMap = (): MapHandler => {
  const MAP_MODE = ref(MapModes.DISPLAY_OSM);
  const _on_reset_callbacks: (() => void)[] = [];
  const _delete_draw_features_callbacks: (() => void)[] = [];
  const _add_features_callbacks: (() => void)[] = [];

  const FEATURES: Ref<Feature[]> = ref([]);

  const changeMode = (mode: MapModes) => {
    MAP_MODE.value = mode;
  };

  const reset = () => {
    MAP_MODE.value = MapModes.DISPLAY_OSM;
    FEATURES.value = [];
    deleteDrawFeatures();
    _on_reset_callbacks.forEach(callback => {
      callback();
    });
  };

  const deleteDrawFeatures = () => {
    _delete_draw_features_callbacks.forEach(callback => callback());
  };

  const onReset = (callback: () => void) => {
    _on_reset_callbacks.push(callback);
  };

  const onDeleteDrawFeatures = (callback: () => void) => {
    _delete_draw_features_callbacks.push(callback);
  };

  const addFeatures = (features: Feature[]) => {
    _add_features_callbacks.forEach(callback => callback());
    features.forEach(feature => {
      FEATURES.value.push(convertToEPSG3857(feature));
    });
  };

  const onFeaturesAdded = (callback: () => void) => {
    _add_features_callbacks.push(callback);
  };

  return { changeMode, reset, onReset, deleteDrawFeatures, onDeleteDrawFeatures, addFeatures, onFeaturesAdded, MAP_MODE, FEATURES };
};