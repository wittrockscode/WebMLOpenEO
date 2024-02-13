<template lang="pug">
NewClassModal(:handler="newClassHandler" :id="ModalIds.TRAINING_DATA__NEW_CLASS_MODAL")
EditClassesModal(
  :handler="editClassesHandler"
  :id="ModalIds.TRAINING_DATA__EDIT_CLASSES_MODAL"
  :trainingDataClasses="trainingDataClasses"
  @delete-class="name => trainingData.removeClass(name)"
)
FinishPolygonModal(
  :handler="finishPolygonHandler"
  :id="ModalIds.TRAINING_DATA__FINISH_POLYGON_MODAL"
  :trainingDataClasses="trainingDataClasses"
  :trainingData="trainingData"
)
EditPolygonModal(
  :handler="editPolygonHandler"
  :id="ModalIds.TRAINING_DATA__EDIT_POLYGON_MODAL"
  :trainingDataClasses="trainingDataClasses"
  :trainingData="trainingData"
)
DeleteWarningModal(:handler="deleteWarningHandler" :id="ModalIds.TRAINING_DATA__DELETE_WARNING_MODAL")
Modal(:handler="handler" title="Training Data" :id="id")
  .flex.items-stretch.content
    .control-group.flex.flex-col.justify-between.mt-4.content-group(v-if="!drawMode")
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
            :value="'Select area for satellite image'"
            @click="selectAreaOftraining"
            full-w
            :disabled="tot === null"
          )
        .wrap(v-if="!(tot === null || aot === null)" v-tippy="{ content: tot === null || aot === null ? 'Please select the date of training and area of training.' : 'Fetch the fitting satellite image for the selected area of training and date range.' }")
          CardButton(
            id="sentinel-img-td-button"
            :value="'Fetch satellite image'"
            @click="fetchSentinelImage"
            full-w
            :disabled="tot === null || aot === null"
            v-tippy="{ content: 'Fetch the fitting satellite image for the selected area of training and date range.' }"
            :loading="loadingImg"
          )
          label.text-xl.ml-1.text-ml-red.font-semibold(for="sentinel-img-aoi-button" v-if="errors.sentinel_img") {{errors.sentinel_img_error_text}}
          .info-box.p-2.mt-4(v-if="showInfoText")
            mdicon.mr-3.self-center.inline-block.icon(name="alert-outline" size="40")
            p.text-base.text-ml-dark.inline-block Black pixels indicate missing data. Values for these pixels will be determined by interpolation. Training results will be worse the more data is missing inside the satellite image (e.g. black pixels).
      .options-group.w-full
        label.text-sm.ml-1.text-ml-red.font-semibold(for="td-upload" v-if="errors.td_feature_collection") {{errors.td_feature_collection_error_text}}
        p.text-lg.font-semibold(for="draw-button-td") Training polygons
        CardButton.mb-5.mt-2(
          id="draw-button-td"
          :value="featueCollectionExists ? 'Edit Training Polygons' : 'Create Training Polygons'"
          @click="toggleDrawMode"
          full-w
          :disabled="tot === null"
          v-tippy="{ content: 'Create new training polygons on the map.' }"
        )
    .control-group.flex.flex-col.justify-around.w-full.mt-4(v-else)
      CardButton(
        id="new-class-button"
        value="Create a new Class"
        @click="newClass"
        v-tippy="{ content: 'Create a new class for the training data.' }"
      )
      CardButton(
        id="view-classes-button"
        value="View all classes"
        @click="viewClasses"
        v-tippy="{ content: 'View all classes for the training data.' }"
      )
      .h-divider.w-full
      CardButton(
        id="new-polygon-button"
        value="Create a new Polygon"
        @click="newPolygon"
        :disabled="trainingDataClasses.length === 0"
        v-tippy="{ content: 'Create a new polygon.' }"
      )
      FileUpload(
          id="td-upload"
          :value="isClickButton ? 'Reset Training Polygons' : 'Import Training Polygons'"
          :types="['json', 'geojson', 'gpkg']"
          input-class="file-upload-label-full"
          :disabled="tot === null"
          @uploaded="(file) => fileUploaded(file)"
          v-tippy="{ content: 'Upload the training data as a GeoJSON or GPKG file.' }"
          @click="showWarningModal('upload')"
          :isClickButton="isClickButton"
        )
      CardButton(
        id="download-td-button"
        value="Download Training Polygons"
        @click="downloadData"
        :disabled="trainingDataPolygons.length === 0"
        v-tippy="{ content: 'Download your created training data.' }"
      )
      button.btn-secondary(
        id="td-back-button"
        type="button"
        v-text="'Back'"
        @click="go_back"
      )
    #td-map
      OlMap(
        :handler="mapHandler"
        feature-select
        @draw-polygon="map_drawend"
        @draw-rect="map_drawrect"
        @feature-selected="featureSelected"
      )
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
import type { Feature, FeatureCollection, Polygon } from "@/types/geojson";
import { OLFeatureToFeature, convertToEPSG4326, featureToOLFeature, featuresToFeatureCollection, geoJsonFileToFeatureCollection, validateGeoJsonFeatureCollection } from "@/helper/geojson";
import NewClassModal from "../training_data/new-class.modal.vue";
import EditClassesModal from "../training_data/edit-classes.modal.vue";
import DatePicker from "@/components/form/DatePicker.vue";
import FinishPolygonModal from "../training_data/finish-polygon.modal.vue";
import DeleteWarningModal from "../training_data/delete-warning-modal.vue";
import EditPolygonModal from "../training_data/edit-polygon-modal.vue";

import { nanoid } from 'nanoid';

import { useModal } from "@/composables/use-modal";
import { useTrainingData } from "@/composables/use-training-data";
import { useApi } from "@/composables/use-api";
import { fromBlob } from "geotiff";
import { convertGPKGToGeoJSON } from "@/helper/gpkg";

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
    DeleteWarningModal,
    EditPolygonModal,
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

    const showInfoText = ref(false);
    const isClickButton = ref(false);

    const drawMode = ref(false);

    const errors = ref({
      sentinel_img: false,
      sentinel_img_error_text: "",
      td_feature_collection: false,
      td_feature_collection_error_text: "",
    });

    const resetData = () => {
      trainingData.resetPolygons();
      mapHandler.reset();
      withFile.value = false;
      fileName.value = "";
      isClickButton.value = false;
      loadingImg.value = false;
      showInfoText.value = false;
      errors.value = {
        sentinel_img: false,
        sentinel_img_error_text: "",
        td_feature_collection: false,
        td_feature_collection_error_text: "",
      };
      drawMode.value = false;
    };

    const newClassHandler = useModal<string>(
      ModalIds.TRAINING_DATA__NEW_CLASS_MODAL,
      (payload: Nullable<string>) => {
        if (payload === null || trainingData.classes.value.includes(payload)) return;
        if (trainingData.currentClass.value === "") trainingData.setCurrentClass(payload);
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

    const deleteWarningHandler = useModal<string>(
      ModalIds.TRAINING_DATA__DELETE_WARNING_MODAL,
      (payload) => {
        if (payload === "upload") {
          mapHandler.reset();
          withFile.value = false;
          fileName.value = "";
          trainingData.resetPolygons();
          trainingData.resetClasses();
          isClickButton.value = false;
        }
      },
      () => {},
      120,
    );

    const editPolygonHandler = useModal<OLFeature>(
      ModalIds.TRAINING_DATA__EDIT_POLYGON_MODAL,
      (feature: OLFeature | null) => {
        if (feature) mapHandler.removeFeature(feature);
      },
      () => {},
      125,
    );

    const trainingDataClasses = computed(() => {
      return trainingData.classes.value;
    });

    const trainingDataPolygons = computed(() => {
      return trainingData.polygons.value;
    });

    const select_on_map = () => {
      mapHandler.block();
      mapHandler.changeMode(MapModes.DRAW_POLYGON);
    };

    const map_drawend = (feature: OLFeature) => {
      mapHandler.changeMode(MapModes.DISPLAY_OSM);
      const format = new OLGeoJSON();
      const geoJsonString = format.writeFeature(feature);
      const geoJson = JSON.parse(geoJsonString) as Feature;
      if (!geoJson.properties) geoJson.properties = {};
      const id = nanoid();
      geoJson.properties["id"] = id;
      feature.setId(id);
      finishPolygonHandler.open(geoJson);

      setTimeout(() => {
        mapHandler.unblock();
      }, 400);
    };

    const map_drawrect = (feature: OLFeature) => {
      mapHandler.changeMode(MapModes.DISPLAY_OSM);
      const format = new OLGeoJSON();
      const geoJsonString = format.writeFeature(feature);
      const geoJson = JSON.parse(geoJsonString) as Feature;
      trainingData.aot.value = geoJson.geometry as Polygon;

      setTimeout(() => {
        mapHandler.unblock();
      }, 400);
    };

    const fileUploaded = async (file: File) => {
      errors.value.td_feature_collection = false;
      errors.value.td_feature_collection_error_text = "";
      let featureCollection: FeatureCollection | null = null;
      const fileName2 = file.name.split(".").slice(-1)[0];

      if (fileName2 === "gpkg") {
        const fileBuffer = await file.arrayBuffer();
        const feats = await convertGPKGToGeoJSON(new Uint8Array(fileBuffer));

        if (feats === undefined || feats === null) {
          errors.value.td_feature_collection = true;
          errors.value.td_feature_collection_error_text = "The uploaded file is not a valid GeoJSON or GPKG file.";
          return;
        } else {
          featureCollection = featuresToFeatureCollection(feats);
        }
      } else if (fileName2 === "json" || fileName2 === "geojson") {
        featureCollection = await geoJsonFileToFeatureCollection(file);

        if (featureCollection === null) {
          errors.value.td_feature_collection = true;
          errors.value.td_feature_collection_error_text = "The uploaded file is not a valid GeoJSON or GPKG file.";
          return;
        }
      } else {
        errors.value.td_feature_collection = true;
        errors.value.td_feature_collection_error_text = "The uploaded file is not a valid GeoJSON or GPKG file.";
        return;
      }

      if(featureCollection === undefined || featureCollection === null || featureCollection.features === undefined) {
        errors.value.td_feature_collection = true;
        errors.value.td_feature_collection_error_text = "The uploaded file is not a valid GeoJSON or GPKG file.";
        return;
      };

      const valid = validateGeoJsonFeatureCollection(featureCollection as FeatureCollection<Polygon>);
      if (Object.values(valid).includes(false)) {
        errors.value.td_feature_collection = true;
        errors.value.td_feature_collection_error_text = "The uploaded file does not contain a valid Polygon Featurecollection.";
        return;
      }

      withFile.value = true;
      fileName.value = file.name;
      featureCollection.features = featureCollection.features.map((feature: Feature) => {
        if (!feature.properties) feature.properties = {};
        feature.properties["id"] = nanoid();

        trainingData.addPolygon(feature);
        if (!trainingData.classes.value.includes(feature.properties?.class as string))
          trainingData.addClass(feature.properties?.class as string);

        return feature;
      });

      isClickButton.value = true;

      mapHandler.addFeatureCollection(featureCollection);
    };

    const selectAreaOftraining = () => {
      mapHandler.block();
      mapHandler.deleteRectFeatures();
      mapHandler.changeMode(MapModes.DRAW_RECTANGLE);
    };

    const downloadData = () => {
      const data = trainingData.getTrainingData();
      const collection = data.collection;
      const converted = collection.features.map((feature) => {
        const props = feature.properties;
        const conv = featureToOLFeature(feature);
        if ((feature.geometry as unknown as any).coordinates[0][0][0] > 190) {
          const epsg3857 = convertToEPSG4326(conv);
          const finalFeature = OLFeatureToFeature(epsg3857);
          finalFeature.properties = props;
          return finalFeature;
        } else {
          const finalFeature = OLFeatureToFeature(conv);
          finalFeature.properties = props;
          return finalFeature;
        }
      });
      collection.features = converted;
      const blob = new Blob([JSON.stringify(data.collection)], { type: "text/json" });
      const link = document.createElement("a");

      link.download = "training_data.json";
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

      const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      link.dispatchEvent(evt);
    };

    const fetchSentinelImage = async () => {
      if (trainingData.tot.value === null || trainingData.aot.value === null) return;
      mapHandler.setBaseTiff(null);
      loadingImg.value = true;
      showInfoText.value = false;

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

      if ('error' in response) {
        const response_error = JSON.parse(await (response.error as any).response.data.text());
        errors.value.sentinel_img = true;
        errors.value.sentinel_img_error_text = response_error.message;
        loadingImg.value = false;
        return;
      }

      const blob = new Blob([response], { type: 'image/tiff' });

      const tiff = await fromBlob(blob);
      const image = await tiff.getImage();
      const rasters = await image.readRasters();

      const nan_vals = rasters.some((raster: any) => {
        return raster.some((pixel: any) => isNaN(pixel));
      });

      if (nan_vals) showInfoText.value = true;

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

    props.handler.onBeforeSubmit(() => {
      const data = trainingData.getTrainingData();
      props.handler.setPayload({ td: data.collection, tot: data.tot!, withFile: withFile.value, fileName: fileName.value });
      return true;
    });

    props.handler.onReset(() => {
      resetData();
    });

    props.handler.onSetState((state: number) => {
      if (state === 0) drawMode.value = false;
      if (state === 1) drawMode.value = true;
    });

    const featureSelected = (feature: OLFeature) => {
      editPolygonHandler.open(feature);
    };

    const showWarningModal = (type: string) => {
      if (type === "upload") {
        if (trainingDataPolygons.value.length > 0) deleteWarningHandler.open("upload");
      }
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
      tot: trainingData.tot,
      aot: trainingData.aot,
      totSelected,
      go_back,
      selectAreaOftraining,
      fetchSentinelImage,
      map_drawrect,
      finishPolygonHandler,
      loadingImg,
      errors,
      deleteWarningHandler,
      showWarningModal,
      showInfoText,
      downloadData,
      trainingDataPolygons,
      isClickButton,
      featureSelected,
      editPolygonHandler,
    };
  },
});
</script>

<style scoped>
#td-map {
  width: 100%;
  display: block;
}

.control-group {
  width: max-content;
  min-width: 30%;
  margin-right: 2rem;
}

.content-group {
  max-width: 30%;
}

.info-box {
  border-radius: 0.25rem;
  background-color: #d3d3d3;
  font-weight: 500;
}

.content {
  min-width: 90vw;
  min-height: 65vh;
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

.h-divider {
  border-top: 1px solid theme("colors.ml-dark");
}
</style>
