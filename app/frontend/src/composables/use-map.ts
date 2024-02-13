import { ref, type Ref } from "vue";
import { MapModes } from "@/enums";
import Feature from "ol/Feature";
import { convertToEPSG3857, featureToOLFeature } from "@/helper/geojson";
import type { FeatureCollection } from "@/types/geojson";


export const useMap = () => {
  const MAP_MODE = ref(MapModes.DISPLAY_OSM);
  const _on_reset_callbacks: (() => void)[] = [];
  const _delete_draw_features_callbacks: (() => void)[] = [];
  const _add_features_callbacks: (() => void)[] = [];
  const _on_base_tiff_set_callbacks: (() => void)[] = [];
  const _on_delete_rect_features_callbacks: (() => void)[] = [];
  const _on_blocked_callbacks: (() => void)[] = [];
  const _on_unblocked_callbacks: (() => void)[] = [];
  const _delete_feature_callbacks: ((feature: Feature) => void)[] = [];

  const FEATURES: Ref<Feature[]> = ref([]);

  const BASE_TIFF: Ref<Blob | null> = ref(null);
  const blocked = ref(false);

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

  const deleteRectFeatures = () => {
    _on_delete_rect_features_callbacks.forEach(callback => callback());
  };

  const onReset = (callback: () => void) => {
    _on_reset_callbacks.push(callback);
  };

  const onDeleteDrawFeatures = (callback: () => void) => {
    _delete_draw_features_callbacks.push(callback);
  };

  const onDeleteRectFeatures = (callback: () => void) => {
    _on_delete_rect_features_callbacks.push(callback);
  };

  const onDeleteFeature = (callback: (feature: Feature) => void) => {
    _delete_feature_callbacks.push(callback);
  };

  const addFeatures = (features: Feature[]) => {
    features.forEach(feature => {
      FEATURES.value.push(convertToEPSG3857(feature));
    });
    _add_features_callbacks.forEach(callback => callback());
  };

  const removeFeature = (feature: Feature) => {
    FEATURES.value = FEATURES.value.filter(f => f.getId() !== feature.getId());
    _delete_feature_callbacks.forEach(callback => callback(feature));
  };

  const addFeatureCollection = (featureCollection: FeatureCollection) => {
    const features = featureCollection.features.map(feature => {
      return featureToOLFeature(feature);
    });
    console.log(features);
    addFeatures(features);
  };

  const setBaseTiff = (tiff: Blob | null) => {
    BASE_TIFF.value = tiff;
    _on_base_tiff_set_callbacks.forEach(callback => callback());
  };

  const onFeaturesAdded = (callback: () => void) => {
    _add_features_callbacks.push(callback);
  };

  const onBaseTiffSet = (callback: () => void) => {
    _on_base_tiff_set_callbacks.push(callback);
  };

  const block = () => {
    blocked.value = true;
    _on_blocked_callbacks.forEach(callback => callback());
  };

  const unblock = () => {
    blocked.value = false;
    _on_unblocked_callbacks.forEach(callback => callback());
  };

  const onBlocked = (callback: () => void) => {
    _on_blocked_callbacks.push(callback);
  };

  const onUnblocked = (callback: () => void) => {
    _on_unblocked_callbacks.push(callback);
  };

  return {
    changeMode,
    reset,
    onReset,
    deleteDrawFeatures,
    onDeleteDrawFeatures,
    addFeatures,
    onFeaturesAdded,
    setBaseTiff,
    onBaseTiffSet,
    deleteRectFeatures,
    onDeleteRectFeatures,
    addFeatureCollection,
    block,
    unblock,
    onBlocked,
    onUnblocked,
    removeFeature,
    onDeleteFeature,
    MAP_MODE,
    FEATURES,
    BASE_TIFF,
    blocked,
  };
};