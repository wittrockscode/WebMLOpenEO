import { ref, type Ref } from "vue";
import type { Feature, FeatureCollection } from "@/types/geojson";
export const useTrainingData = () => {
  const classes: Ref<string[]> = ref([]);
  const polygons: Ref<Feature[]> = ref([]);

  const addClass = (name: string) => {
    classes.value.push(name);
  };

  const removeClass = (name: string) => {
    classes.value = classes.value.filter((c) => c !== name);
  };

  const addPolygon = (polygon: Feature) => {
    polygons.value.push(polygon);
  };

  const removePolygon = (polygon: Feature) => {
    polygons.value = polygons.value.filter((p) => p.id !== polygon.id);
  };

  const setPolygonClass = (polygon: Feature, className: string) => {
    const poly = polygons.value.find((p) => p?.properties?.name === polygon?.properties?.name);
    if (!poly) return;

    poly.properties!.class = className;
  };

  const getTrainingData = (): FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: polygons.value,
    };
  };

  return { classes, polygons, addClass, removeClass, addPolygon, removePolygon, setPolygonClass, getTrainingData };
};