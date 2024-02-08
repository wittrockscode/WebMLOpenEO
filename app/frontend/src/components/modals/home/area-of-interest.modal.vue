<template lang="pug">
Modal(:handler="handler" title="Area of Interest" :id="id")
  .flex
    .control-group.flex.flex-col.justify-between.w-full.mt-4
      .options-group.w-full
        .date-select.text-left
          label.text-lg.font-semibold(for="tot-select") Select the Time of Interest
          DatePicker.mt-2(
            id="toi-select"
            placeholder="Select"
            @selected="toiSelected" :completed="toi !== null"
            :value="toi"
            range
            v-tippy="{ content: 'Select the date range for the training data.' }"
          )
      .options-group.w-full
        CardButton.mb-5(
          id="draw-button"
          :value="isPolygonSelected ? 'Draw a new Polygon' : 'Select on map'"
          @click="select_on_map"
          full-w
          :disabled="toi === null"
          v-tippy="{ content: 'Create a new Polygon on the map.' }"
        )
        FileUpload(
          id="aoi-upload"
          value="Upload GeoJSON"
          :types="['json', 'geojson']"
          input-class="file-upload-label-full"
          @uploaded="(file) => fileUploaded(file)"
          :disabled="toi === null"
          v-tippy="{ content: 'Upload the Area of Interest as a GeoJSON or GPKG file.' }"
        )
    #aoi-map
      OlMap(@draw-polygon="map_drawend" :handler="mapHandler")
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "@/components/base/Modal.vue";
import type { PropType } from "vue";
import OlMap from "@/components/map/OlMap.vue";
import CardButton from "@/components/base/CardButton.vue";
import FileUpload from "@/components/form/FileUpload.vue";
import { MapModes } from "@/enums";
import { useMap } from "@/composables/use-map";
import { Feature as OLFeature } from "ol";
import OLGeoJSON from 'ol/format/GeoJSON';
import type { Feature } from "@/types/geojson";
import { geoJsonFileToFeatures, featureToOLFeature } from "@/helper/geojson";
import DatePicker from "@/components/form/DatePicker.vue";
import type { useModal } from "@/composables/use-modal";

export default defineComponent({
  components: {
    Modal,
    OlMap,
    CardButton,
    FileUpload,
    DatePicker,
  },
  props: {
    handler: {
      type: Object as PropType<ReturnType<typeof useModal>>,
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
    const aoi = ref<Feature | null>(null);
    const toi = ref<Date[] | null>(null);
    const withFile = ref(false);
    const fileName = ref("");
    const toiSelected = (date: Date[]) => {
      toi.value = date;
    };

    const select_on_map = () => {
      withFile.value = false;
      fileName.value = "";
      mapHandler.reset();
      mapHandler.deleteDrawFeatures();
      mapHandler.changeMode(MapModes.DRAW_POLYGON);
    };

    const map_drawend = (feature: OLFeature) => {
      const format = new OLGeoJSON();
      const geoJsonString = format.writeFeature(feature);
      const geoJson = JSON.parse(geoJsonString) as Feature;
      mapHandler.changeMode(MapModes.DISPLAY_OSM);
      aoi.value = geoJson;
    };

    const fileUploaded = async (file: File) => {
      mapHandler.reset();
      const features = await geoJsonFileToFeatures(file) as Feature[] | null;
      if(features !== null && features.length === 1) {
        aoi.value = features[0]!;
        withFile.value = true;
        fileName.value = file.name;
        mapHandler.addFeatures([featureToOLFeature(aoi.value)]);
      }
    };

    props.handler.onSubmit(() => {
      props.handler.setPayload({ aoi: aoi.value, toi: toi.value, withFile: withFile.value, fileName: fileName.value});
    });

    return { select_on_map, map_drawend, mapHandler, fileUploaded, toi, toiSelected };
  },
});
</script>

<style scoped>
#aoi-map {
  width: 60vw;
  height: 60vh;
  display: block;
}

.control-group {
  width: max-content;
  min-width: 30%;
  margin-right: 2rem;
}

.dp__theme_dark {
  --dp-background-color: theme("colors.ml-dark") !important;
  --dp-text-color: theme("colors.ml-text") !important;
  --dp-hover-color: theme("colors.ml-text") !important;
  --dp-hover-text-color: theme("colors.ml-black") !important;
  --dp-hover-icon-color: theme("colors.ml-black") !important;
  --dp-primary-color: theme("colors.ml-blue") !important;
  --dp-primary-text-color: theme("colors.ml-black") !important;
  --dp-menu-border-color: theme("colors.ml-dark") !important;
}

#toi-select {
  background-color: theme("colors.ml-dark") !important;
}
</style>
