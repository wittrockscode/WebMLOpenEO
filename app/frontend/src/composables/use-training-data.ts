import { ref, type Ref } from "vue";
import type { Feature, FeatureCollection, Polygon } from "@/types/geojson";
export const useTrainingData = () => {
  const classes: Ref<string[]> = ref([]);
  const polygons: Ref<Feature[]> = ref([]);
  const aot: Ref<Polygon |null> = ref(null);
  const tot: Ref<Date[] | null> = ref(null);
  const currentClass = ref("");

  const addClass = (name: string) => {
    classes.value.push(name);
  };

  const removeClass = (name: string) => {
    classes.value = classes.value.filter((c) => c !== name);
  };

  const addPolygon = (polygon: Feature) => {
    polygons.value.push(polygon);
  };

  const removePolygon = (id: string | null) => {
    polygons.value = polygons.value.filter((p) => p.properties?.id !== id);
  };

  const setPolygonClass = (id: string | null, className: string) => {
    const poly = polygons.value.find((p) => p?.properties?.id === id);
    if (!poly) return;

    poly.properties!.class = className;
  };

  const setAot = (feature: Polygon) => {
    aot.value = feature;
  };

  const setTot = (dates: Date[]) => {
    tot.value = dates;
  };

  const getTrainingData = () => {
    return {
      tot: tot.value,
      collection: {
        type: "FeatureCollection",
        features: polygons.value,
        crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      } as FeatureCollection,
    };
  };

  const setCurrentClass = (name: string) => {
    currentClass.value = name;
  };

  const resetPolygons = () => {
    polygons.value = [];
  };

  const resetClasses = () => {
    classes.value = [];
  };

  const reset = () => {
    classes.value = [];
    polygons.value = [];
    aot.value = null;
    tot.value = null;
    currentClass.value = "";
  };

  return { classes, polygons, aot, tot, currentClass, reset, resetClasses, resetPolygons, setCurrentClass, setTot, setAot, addClass, removeClass, addPolygon, removePolygon, setPolygonClass, getTrainingData };
};