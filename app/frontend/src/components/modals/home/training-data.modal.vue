<template lang="pug">
NewClassModal(:handler="newClassHandler" :id="ModalIds.TRAINING_DATA__NEW_CLASS_MODAL")
EditClassesModal(
  :handler="editClassesHandler"
  :id="ModalIds.TRAINING_DATA__EDIT_CLASSES_MODAL"
  :trainingDataClasses="trainingDataClasses"
  @delete-class="name => trainingData.removeClass(name)"
)
Modal(:handler="handler" title="Training Data" :id="id")
  .flex
    .control-group.flex.flex-col.justify-between.w-full.mt-4(v-if="!drawMode")
      .options-group.w-full
        .date-select.text-left.mb-5
          label.text-lg.font-semibold(for="tot-select") Select the date for the training data
          DatePicker.mt-2(id="tot-select" placeholder="Select" @selected="totSelected" :completed="tot !== null" :value="tot" range)
        CardButton.mb-5(
          id="aot-button"
          :value="'Select area of training'"
          @click="selectAreaOftraining"
          full-w
          :disabled="tot === null"
        )
        CardButton(
          id="sentinel-img-td-button"
          :value="'Fetch fitting satellite image'"
          @click="fetchSentinelImage"
          full-w
          :disabled="tot === null || aot === null"
        )
      .options-group.w-full
        CardButton.mb-5(
          id="draw-button-td"
          :value="featueCollectionExists ? 'Edit current selection' : 'Select on map'"
          @click="toggleDrawMode"
          full-w
          :disabled="tot === null || aot === null"
        )
        FileUpload(
          id="td-upload"
          value="Upload GeoJSON"
          :types="['json', 'geojson']"
          input-class="file-upload-label-full"
          :disabled="tot === null"
          @uploaded="(file) => fileUploaded(file)"
        )
    .control-group.flex.flex-col.justify-around.w-full.mt-4(v-else)
      CardButton(
        id="new-class-button"
        value="Create a new Class"
        @click="newClass"
        icon
        iconText="pencil-outline"
      )
      CardButton(
        id="new-polygon-button"
        value="Select a new Polygon"
        @click="newPolygon"
        icon
        iconText="vector-polyline-plus"
      )
      CardButton(
        id="view-classes-button"
        value="View all classes"
        @click="viewClasses"
        alignText="left"
      )
      button.btn-secondary(
        id="td-back-button"
        type="button"
        v-text="'Back'"
        @click="go_back"
      )
    #td-map
      OlMap(@draw-polygon="map_drawend" :handler="mapHandler" @draw-rect="map_drawrect")
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Modal from "@/components/base/Modal.vue";
import type { PropType, Ref } from "vue";
import type { ModalHandler, SubmitPayload } from "@/types/AppTypes";
import OlMap from "@/components/map/OlMap.vue";
import CardButton from "@/components/base/CardButton.vue";
import FileUpload from "@/components/form/FileUpload.vue";
import { MapModes, ModalIds } from "@/enums";
import { useMap } from "@/composables/use-map";
import { Feature as OLFeature } from "ol";
import OLGeoJSON from 'ol/format/GeoJSON';
import type { Feature, Polygon } from "@/types/geojson";
import { geoJsonFileToFeatures } from "@/helper/geojson";
import { useTrainingData } from "@/composables/use-training-data";
import { useModal } from "@/composables/use-modal";
import NewClassModal from "../training_data/new-class.modal.vue";
import EditClassesModal from "../training_data/edit-classes.modal.vue";
import DatePicker from "@/components/form/DatePicker.vue";

import { useApi } from "@/composables/use-api";

export default defineComponent({
  components: {
    Modal,
    OlMap,
    CardButton,
    FileUpload,
    NewClassModal,
    EditClassesModal,
    DatePicker,
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
    featueCollectionExists: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const mapHandler = useMap();
    const newClassHandler = useModal(
      ModalIds.TRAINING_DATA__NEW_CLASS_MODAL,
      (payload: SubmitPayload) => {
        if (payload === null || trainingData.classes.value.includes(payload as string)) return;
        trainingData.addClass(payload as string);
      },
      () => {},
      110,
    );

    const editClassesHandler = useModal(ModalIds.TRAINING_DATA__EDIT_CLASSES_MODAL, () => {}, () => {}, 110);
    const trainingData = useTrainingData();
    const drawMode = ref(false);

    const tot: Ref<Date[] | null> = ref(null);

    const aot = ref<Polygon | null>(null);

    const trainingDataClasses = computed(() => {
      return trainingData.classes.value;
    });

    const { sentinel_img_request } = useApi();

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

    const map_drawrect = (feature: OLFeature) => {
      const format = new OLGeoJSON();
      const geoJsonString = format.writeFeature(feature);
      const geoJson = JSON.parse(geoJsonString) as Feature;
      mapHandler.changeMode(MapModes.DISPLAY_OSM);
      aot.value = geoJson.geometry as Polygon;
    };

    const fileUploaded = async (file: File) => {
      mapHandler.reset();
      const features = await geoJsonFileToFeatures(file) as unknown;
      if(features !== null) {
        props.handler.setPayload(file);
        mapHandler.addFeatures(features as OLFeature[]);
      }
    };

    const selectAreaOftraining = () => {
      mapHandler.changeMode(MapModes.DRAW_RECTANGLE);
    };

    const fetchSentinelImage = async () => {
      if (tot.value === null || aot.value === null) return;

      const payload = {
        AOI: {
          geometry: aot.value!,
        },
        TOI: {
          start_date: tot.value![0]!.toISOString().split("T")[0]!,
          end_date: tot.value![1]!.toISOString().split("T")[0]!,
        }
      };
      const response = await sentinel_img_request(payload);
      mapHandler.setBaseTiff(response.data);
    };

    const newPolygon = () => {
      select_on_map();
    };

    const newClass = () => {
      newClassHandler.open();
    };

    const viewClasses = () => {
      editClassesHandler.open();
    };

    const toggleDrawMode = () => {
      drawMode.value = true;
    };

    const totSelected = (dates: Date[]) => {
      tot.value = dates;
    };

    const go_back = () => {
      drawMode.value = false;
    };

    return {
      select_on_map,
      map_drawend,
      mapHandler,
      fileUploaded,
      drawMode,
      newPolygon,
      newClass,
      toggleDrawMode,
      ModalIds,
      trainingData,
      newClassHandler,
      viewClasses,
      editClassesHandler,
      trainingDataClasses,
      tot,
      aot,
      totSelected,
      go_back,
      selectAreaOftraining,
      fetchSentinelImage,
      map_drawrect,
    };
  },
});
</script>

<style scoped>
#td-map {
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

#tot-select {
  background-color: theme("colors.ml-dark") !important;
}
</style>
