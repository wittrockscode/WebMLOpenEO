import { ref } from "vue";
import { MapModes } from "@/enums";
import type { MapHandler } from "@/types/handlers";


export const useMap = (): MapHandler => {
  const MAP_MODE = ref(MapModes.DISPLAY_OSM);
  const _on_reset_callbacks: (() => void)[] = [];
  const _delete_draw_features_callbacks: (() => void)[] = [];

  const changeMode = (mode: MapModes) => {
    MAP_MODE.value = mode;
  };

  const reset = () => {
    MAP_MODE.value = MapModes.DISPLAY_OSM;
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

  return { changeMode, reset, onReset, deleteDrawFeatures, onDeleteDrawFeatures, MAP_MODE };
};