<template lang="pug">
NewClassModal(:handler="newClassHandler" :id="ModalIds.TRAINING_DATA__NEW_CLASS_MODAL")
EditClassesModal(
  :handler="editClassesHandler"
  :id="ModalIds.TRAINING_DATA__EDIT_CLASSES_MODAL"
  :trainingDataClasses="trainingDataClasses"
  @delete-class="name => trainingData.removeClass(name)"
)
FinishPolygonModal(:handler="finishPolygonHandler" :id="ModalIds.TRAINING_DATA__FINISH_POLYGON_MODAL" :trainingDataClasses="trainingDataClasses")
Modal(:handler="handler" title="Training Data" :id="id")
  .flex
    .control-group.flex.flex-col.justify-between.w-full.mt-4(v-if="!drawMode")
      .options-group.w-full
        .date-select.text-left.mb-5
          label.text-lg.font-semibold(for="tot-select") Select the date for the training data
          DatePicker.mt-2(
            id="tot-select"
            placeholder="Select"
            @selected="totSelected" :completed="tot !== null"
            :value="tot"
            range
            v-tippy="{ content: 'Select the date range for the training data.' }"
          )
        .wrap(v-tippy="{ content: tot === null ? 'Please select the date of training' : 'Select the area of training on the map.' }")
          CardButton.mb-5(
            id="aot-button"
            :value="'Select area of training'"
            @click="selectAreaOftraining"
            full-w
            :disabled="tot === null"
          )
        .wrap(v-tippy="{ content: tot === null || aot === null ? 'Please select the date of training and area of training.' : 'Fetch the fitting satellite image for the selected area of training and date range.' }")
          CardButton(
            id="sentinel-img-td-button"
            :value="'Fetch fitting satellite image'"
            @click="fetchSentinelImage"
            full-w
            :disabled="tot === null || aot === null"
            v-tippy="{ content: 'Fetch the fitting satellite image for the selected area of training and date range.' }"
            :loading="loadingImg"
          )
      .options-group.w-full
        CardButton.mb-5(
          id="draw-button-td"
          :value="featueCollectionExists ? 'Edit current selection' : 'Select on map'"
          @click="toggleDrawMode"
          full-w
          :disabled="tot === null || aot === null"
          v-tippy="{ content: 'Create new training polygons on the map.' }"
        )
        FileUpload(
          id="td-upload"
          value="Upload GeoJSON"
          :types="['json', 'geojson']"
          input-class="file-upload-label-full"
          :disabled="tot === null"
          @uploaded="(file) => fileUploaded(file)"
          v-tippy="{ content: 'Upload the training data as a GeoJSON or GPKG file.' }"
        )
    .control-group.flex.flex-col.justify-around.w-full.mt-4(v-else)
      CardButton(
        id="new-class-button"
        value="Create a new Class"
        @click="newClass"
        icon
        iconText="pencil-outline"
        v-tippy="{ content: 'Create a new class for the training data.' }"
      )
      CardButton(
        id="new-polygon-button"
        value="Select a new Polygon"
        @click="newPolygon"
        :disabled="trainingDataClasses.length === 0"
        icon
        iconText="vector-polyline-plus"
        v-tippy="{ content: 'Create a new polygon.' }"
      )
      CardButton(
        id="view-classes-button"
        value="View all classes"
        @click="viewClasses"
        alignText="left"
        v-tippy="{ content: 'View all classes for the training data.' }"
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
import type { PropType } from "vue";
import type { Nullable, TdModalPayload } from "@/types/AppTypes";
import OlMap from "@/components/map/OlMap.vue";
import CardButton from "@/components/base/CardButton.vue";
import FileUpload from "@/components/form/FileUpload.vue";
import { MapModes, ModalIds } from "@/enums";
import { useMap } from "@/composables/use-map";
import { Feature as OLFeature } from "ol";
import OLGeoJSON from 'ol/format/GeoJSON';
import type { Feature, Polygon } from "@/types/geojson";
import { geoJsonFileToFeatureCollection } from "@/helper/geojson";
import NewClassModal from "../training_data/new-class.modal.vue";
import EditClassesModal from "../training_data/edit-classes.modal.vue";
import DatePicker from "@/components/form/DatePicker.vue";
import FinishPolygonModal from "../training_data/finish-polygon.modal.vue";

import { useModal } from "@/composables/use-modal";
import { useTrainingData } from "@/composables/use-training-data";
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
    FinishPolygonModal,
  },
  props: {
    handler: {
      type: Object as PropType<ReturnType<typeof useModal<TdModalPayload>>>,
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
    const editClassesHandler = useModal(ModalIds.TRAINING_DATA__EDIT_CLASSES_MODAL, () => {}, () => {}, 110);
    const trainingData = useTrainingData();
    const { sentinel_img_request } = useApi();

    const withFile = ref(false);
    const fileName = ref("");

    const loadingImg = ref(false);

    const newClassHandler = useModal<string>(
      ModalIds.TRAINING_DATA__NEW_CLASS_MODAL,
      (payload: Nullable<string>) => {
        if (payload === null || trainingData.classes.value.includes(payload)) return;
        trainingData.addClass(payload);
      },
      () => {},
      110,
    );

    const finishPolygonHandler = useModal<Feature>(
      ModalIds.TRAINING_DATA__FINISH_POLYGON_MODAL,
      (payload) => {
        if (payload === null) return;
        trainingData.addPolygon(payload as Feature);
      },
      () => {},
      115,
    );

    const drawMode = ref(false);

    const trainingDataClasses = computed(() => {
      return trainingData.classes.value;
    });

    const select_on_map = () => {
      if (withFile.value) {
        mapHandler.reset();
        withFile.value = false;
        fileName.value = "";
      }
      mapHandler.changeMode(MapModes.DRAW_POLYGON);
    };

    const map_drawend = (feature: OLFeature) => {
      const format = new OLGeoJSON();
      const geoJsonString = format.writeFeature(feature);
      const geoJson = JSON.parse(geoJsonString) as Feature;
      mapHandler.changeMode(MapModes.DISPLAY_OSM);
      finishPolygonHandler.open(geoJson);
    };

    const map_drawrect = (feature: OLFeature) => {
      const format = new OLGeoJSON();
      const geoJsonString = format.writeFeature(feature);
      const geoJson = JSON.parse(geoJsonString) as Feature;
      mapHandler.changeMode(MapModes.DISPLAY_OSM);
      trainingData.aot.value = geoJson.geometry as Polygon;
    };

    const fileUploaded = async (file: File) => {
      mapHandler.reset();
      const featureCollection = await geoJsonFileToFeatureCollection(file);
      if(featureCollection === null) return;

      withFile.value = true;
      fileName.value = file.name;
      featureCollection.features.forEach((feature) => {
        trainingData.addPolygon(feature);
      });
      mapHandler.addFeatureCollection(featureCollection);
    };

    const selectAreaOftraining = () => {
      mapHandler.deleteRectFeatures();
      mapHandler.changeMode(MapModes.DRAW_RECTANGLE);
    };

    const fetchSentinelImage = async () => {
      if (trainingData.tot.value === null || trainingData.aot.value === null) return;
      loadingImg.value = true;

      const payload = {
        AOI: {
          geometry: trainingData.aot.value!,
        },
        TOI: {
          start_date: trainingData.tot.value![0]!.toISOString().split("T")[0]!,
          end_date: trainingData.tot.value![1]!.toISOString().split("T")[0]!,
        }
      };

      const response = await sentinel_img_request(payload);

      const blob = new Blob([response], { type: 'image/tiff' });

      mapHandler.setBaseTiff(blob);
      loadingImg.value = false;
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
      trainingData.tot.value = dates;
    };

    const go_back = () => {
      drawMode.value = false;
    };

    props.handler.onSubmit(() => {
      const data = trainingData.getTrainingData();
      props.handler.setPayload({ td: data.collection, tot: data.tot!, withFile: withFile.value, fileName: fileName.value });
    });

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
      tot: trainingData.tot,
      aot: trainingData.aot,
      totSelected,
      go_back,
      selectAreaOftraining,
      fetchSentinelImage,
      map_drawrect,
      finishPolygonHandler,
      loadingImg,
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
