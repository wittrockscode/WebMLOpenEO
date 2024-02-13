<template lang="pug">
Modal(:handler="handler" title="Area of Interest" :id="id")
  .flex.content
    .control-group.flex.flex-col.justify-between.w-full.mt-4.content-group
      .options-group.w-full
        .date-select.text-left
          label.text-lg.font-semibold(for="tot-select") Select the Time of Interest
          DatePicker.mt-2.mb-5(
            id="toi-select"
            placeholder="Select"
            @selected="toiSelected" :completed="toi !== null"
            :value="toi"
            range
            v-tippy="{ content: 'Select the date range for the training data.' }"
          )
          label.text-lg.font-semibold(for="draw-button") Area of Interest
          CardButton.mb-5.mt-2(
            id="draw-button"
            :value="isPolygonSelected ? 'Draw a new Polygon' : 'Select on map'"
            @click="select_on_map"
            full-w
            :disabled="toi === null"
            v-tippy="{ content: 'Create a new Polygon on the map.' }"
          )
          CardButton(
            id="sentinel-img-aoi-button"
            :value="'Fetch satellite image'"
            @click="fetchSentinelImage"
            full-w
            :disabled="toi === null || aoi === null"
            v-tippy="{ content: 'Fetch the fitting satellite image for the selected area.' }"
            :loading="loadingImg"
          )
          label.text-xl.ml-1.text-ml-red.font-semibold( v-if="errors.sentinel_img") {{errors.sentinel_img_error_text}}
          .info-box.w-full.p-2.mt-4(v-if="showInfoText")
            mdicon.mr-3.self-center.inline-block.icon(name="alert-outline" size="40")
            p.text-base.text-ml-dark.inline-block Black pixels indicate missing data. Values for these pixels will be determined by interpolation. Classification results will be worse the more data is missing inside the satellite image (e.g. black pixels).
      .options-group.w-full
        p.text-sm.ml-1.text-ml-red.font-semibold(for="aoi-upload" v-if="errors.aoi_feature") {{errors.aoi_feature_error_text}}
        label.text-lg.font-semibold(for="aoi-upload") Upload Area of Interest
        FileUpload.mt-1(
          id="aoi-upload"
          value="Upload File"
          :types="['json', 'geojson', 'gpkg']"
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
import type { Feature, Polygon } from "@/types/geojson";
import { geoJsonFileToFeatures, featureToOLFeature, validateGeoJsonFeaturePolygon } from "@/helper/geojson";
import DatePicker from "@/components/form/DatePicker.vue";
import type { useModal } from "@/composables/use-modal";
import { useApi } from "@/composables/use-api";
import { fromBlob } from "geotiff";
import { convertGPKGToGeoJSON } from "@/helper/gpkg";

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
    const aoi = ref<Feature<Polygon> | null>(null);
    const toi = ref<Date[] | null>(null);
    const withFile = ref(false);
    const fileName = ref("");
    const errors =  ref({
      sentinel_img: false,
      sentinel_img_error_text: "",
      aoi_feature: false,
      aoi_feature_error_text: "",
    });

    const resetData = () => {
      aoi.value = null;
      toi.value = null;
      withFile.value = false;
      fileName.value = "";
      errors.value.sentinel_img = false;
      errors.value.sentinel_img_error_text = "";
      errors.value.aoi_feature = false;
      errors.value.aoi_feature_error_text = "";
      mapHandler.reset();
    };

    const toiSelected = (date: Date[]) => {
      toi.value = date;
    };
    const showInfoText = ref(false);

    const { sentinel_img_request } = useApi();

    const loadingImg = ref(false);

    const fetchSentinelImage = async () => {
      if (aoi.value === null || toi.value === null || loadingImg.value) return;

      mapHandler.setBaseTiff(null);
      showInfoText.value = false;
      errors.value.sentinel_img = false;
      errors.value.sentinel_img_error_text = "";
      loadingImg.value = true;

      const payload = {
        AOI: {
          geometry: aoi.value!.geometry,
        },
        TOI: {
          start_date: toi.value![0]!.toISOString().split("T")[0]!,
          end_date: toi.value![1]!.toISOString().split("T")[0]!,
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

    const select_on_map = () => {
      withFile.value = false;
      fileName.value = "";
      errors.value.aoi_feature = false;
      errors.value.aoi_feature_error_text = "";
      mapHandler.reset();
      mapHandler.deleteRectFeatures();
      mapHandler.changeMode(MapModes.DRAW_POLYGON);
    };

    const map_drawend = (feature: OLFeature) => {
      const format = new OLGeoJSON();
      const geoJsonString = format.writeFeature(feature);
      const geoJson = JSON.parse(geoJsonString) as Feature<Polygon>;
      mapHandler.changeMode(MapModes.DISPLAY_OSM);
      aoi.value = geoJson;
    };

    const fileUploaded = async (file: File) => {
      mapHandler.reset();
      errors.value.aoi_feature = false;
      errors.value.aoi_feature_error_text = "";

      const fileName2 = file.name.split(".");
      const fileExtension = fileName2[fileName2.length - 1];

      let features = null;
      if (fileExtension === "gpkg") {
        const fileBuffer = await file.arrayBuffer();
        features = await convertGPKGToGeoJSON(new Uint8Array(fileBuffer));
        if (features === null) {
          errors.value.aoi_feature = true;
          errors.value.aoi_feature_error_text = "The uploaded file is not a valid GeoJSON or GPKG file.";
          return;
        }
      } else if (fileExtension === "json" || fileExtension === "geojson") {
        features = await geoJsonFileToFeatures(file) as Feature<Polygon>[] | null;
        if (features === null) {
          errors.value.aoi_feature = true;
          errors.value.aoi_feature_error_text = "The uploaded file is not a valid GeoJSON or GPKG file.";
          return;
        }
      } else {
        errors.value.aoi_feature = true;
        errors.value.aoi_feature_error_text = "The uploaded file is not a valid GeoJSON or GPKG file.";
        return;
      }

      if (features !== undefined && features !== null && features.length === 1) {
        const valid = validateGeoJsonFeaturePolygon((features[0] as Feature<Polygon>)!);
        if (Object.values(valid).includes(false)) {
          errors.value.aoi_feature = true;
          errors.value.aoi_feature_error_text = "The uploaded file does not contain a valid Polygon Feature.";
          return;
        }
        aoi.value = features[0]! as Feature<Polygon>;
        withFile.value = true;
        fileName.value = file.name;
        mapHandler.addFeatures([featureToOLFeature(aoi.value)]);
      } else {
        if (features === null) {
          errors.value.aoi_feature = true;
          errors.value.aoi_feature_error_text = "The uploaded file is not a valid GeoJSON or GPKG file.";
          return;
        } else {
          errors.value.aoi_feature = true;
          errors.value.aoi_feature_error_text = "The uploaded file contains more than one Feature.";
        }
      }
    };

    props.handler.onBeforeSubmit(() => {
      props.handler.setPayload({ aoi: aoi.value, toi: toi.value, withFile: withFile.value, fileName: fileName.value});
      return true;
    });

    props.handler.onReset(() => {
      resetData();
    });

    return {
      select_on_map,
      map_drawend,
      mapHandler,
      fileUploaded,
      toi,
      aoi,
      toiSelected,
      loadingImg,
      fetchSentinelImage,
      errors,
      showInfoText,
    };
  },
});
</script>

<style scoped>
#aoi-map {
  width: 100%;
  display: block;
}

.control-group {
  width: max-content;
  min-width: 30%;
  margin-right: 2rem;
  max-width: 30%
}

.info-box {
  border-radius: 0.25rem;
  background-color: #d3d3d3;
  font-weight: 500;
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

#toi-select {
  background-color: theme("colors.ml-dark") !important;
}
</style>
