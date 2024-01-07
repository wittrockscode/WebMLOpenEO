<template lang="pug">
Modal(:handler="handler" title="Area of Interest" :id="id")
  #aoi-map
    OlMap(@drawend="map_drawend" :handler="mapHandler")
  .control-group.flex.justify-between.w-full.mt-4
    CardButton(id="draw-button" :value="isPolygonSelected ? 'Draw a new Polygon' : 'Select on map'" @click="select_on_map")
    strong(v-text="'or'")
    FileUpload(
      id="aoi-upload"
      value="Upload GeoJSON"
      :types="['json', 'geojson']"
      input-class="file-upload-label-full"
      @uploaded="(file) => fileUploaded(file)"
    )
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "@/components/base/Modal.vue";
import type { PropType } from "vue";
import type { ModalHandler } from "@/types/handlers";
import OlMap from "@/components/map/OlMap.vue";
import CardButton from "@/components/base/CardButton.vue";
import FileUpload from "@/components/form/FileUpload.vue";
import { MapModes } from "@/enums";
import { useMap } from "@/composables/use-map";
import { Feature as OLFeature } from "ol";
import OLGeoJSON from 'ol/format/GeoJSON';
import type { Feature } from "@/types/geojson";
import { geoJsonFileToFeatures } from "@/helper/geojson";

export default defineComponent({
  components: {
    Modal,
    OlMap,
    CardButton,
    FileUpload,
  },
  props: {
    handler: {
      type: Object as PropType<ModalHandler>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    isPolygonSelected: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const mapHandler = useMap();

    const select_on_map = () => {
      mapHandler.reset();
      mapHandler.deleteDrawFeatures();
      mapHandler.changeMode(MapModes.DRAW_POLYGON);
    };

    const map_drawend = (feature: OLFeature) => {
      const format = new OLGeoJSON();
      const geoJsonString = format.writeFeature(feature);
      const geoJson = JSON.parse(geoJsonString) as Feature;
      mapHandler.changeMode(MapModes.DISPLAY_OSM);
      props.handler.setPayload(geoJson);
    };

    const fileUploaded = async (file: File) => {
      mapHandler.reset();
      const features = await geoJsonFileToFeatures(file) as unknown;
      if(features !== null) {
        props.handler.setPayload(file);
        mapHandler.addFeatures(features as OLFeature[]);
      }
    };

    return { select_on_map, map_drawend, mapHandler, fileUploaded };
  },
});
</script>

<style scoped>
#aoi-map {
  width: 50vw;
  height: 50vh;
  display: block;
}
</style>