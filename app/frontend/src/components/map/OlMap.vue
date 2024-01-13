<template lang="pug">
ol-map(
  :loadTilesWhileAnimating="true"
  :loadTilesWhileInteracting="true"
  style="height:100%;width: 100%;"
  :style="{ 'cursor': mapCursor }"
  ref="mapRef"
  @mousedown="mousedown"
  @mouseup="mouseup"
)
  ol-view(
    ref="view"
    :center="center"
    :rotation="rotation"
    :zoom="zoom"
    :projection="projection"
  )
  ol-tile-layer
    ol-source-osm
  ol-vector-layer
    ol-source-vector(:projection="projection" ref="drawSourceRef")
      ol-interaction-draw(
        v-if="MODE === MapModes.DRAW_POLYGON"
        type="Polygon"
        @drawend="(event: DrawEvent) => $emit('drawend', event.feature)"
      )
        ol-style
          ol-style-stroke(color="rgb(147, 54, 180)" :width="3")
          ol-style-fill(color="rgba(255, 231, 155, 0.4)")
  ol-vector-layer
    ol-source-vector(:features="FEATURES" :projection="projection" ref="featureSourceRef")
      ol-style
        ol-style-stroke(color="rgb(147, 54, 180)" :width="3")
        ol-style-fill(color="rgba(255, 231, 155, 0.4)")
</template>

<script lang="ts">
import { computed, ref, type PropType, nextTick } from "vue";
import { defineComponent } from "vue";
import { MapModes } from "@/enums";
import VectorSource from 'ol/source/Vector';
import { Map as OLMap } from 'ol';
import type { MapHandler } from "@/types/AppTypes";

export default defineComponent({
  props: {
    handler: {
      type: Object as PropType<MapHandler>,
      required: true,
    },
  },
  emits: ["drawend"],
  setup(props) {
    const center = ref([848933.5687385835, 6793022.627243362]);
    const projection = ref("EPSG:3857");
    const zoom = ref(15);
    const rotation = ref(0);

    const drawSourceRef = ref<any>(null);
    const featureSourceRef = ref<any>(null);
    const mapRef = ref<any>(null);

    props.handler.onDeleteDrawFeatures(() => {
      removeDrawFeatures();
    });

    const isMouseDown = ref(false);
    const mapCursor = computed(() => {
      switch (props.handler.MAP_MODE.value) {
        case MapModes.DISPLAY_OSM:
          return isMouseDown.value ? "grab" : "move" ;
        case MapModes.DRAW_POLYGON:
          return "none";
        default:
          return "none";
      }
    });

    const removeDrawFeatures = () => {
      const drawSource: VectorSource = drawSourceRef.value.source;
      drawSource.clear();
    };

    const mousedown = () => {
      isMouseDown.value = true;
    };

    const mouseup = () => {
      isMouseDown.value = false;
    };

    const fitToFeatures = () => {
      if(mapRef.value?.map !== (null || undefined) && featureSourceRef.value.source?.getExtent() !== (null || undefined)){
        const featureSource: VectorSource = featureSourceRef.value.source;
        const map: OLMap = mapRef.value!.map!;
        map.getView().fit(featureSource.getExtent(), { size: map.getSize(), padding: [50, 50, 50, 50] });
      }
    };

    props.handler.onFeaturesAdded(async () => {
      await nextTick();
      fitToFeatures();
    });

    return {
      center,
      projection,
      zoom,
      rotation,
      MODE: props.handler.MAP_MODE,
      FEATURES: props.handler.FEATURES,
      MapModes,
      mapCursor,
      drawSourceRef,
      featureSourceRef,
      mapRef,
      mousedown,
      mouseup,
    };
  },
});
</script>

<style scoped></style>
@/types/AppTypes