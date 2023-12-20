<template lang="pug">
AreaOfInterestModal(:handler="aoi_modal_handler" :id="ModalIds.HOME__AREA_OF_INTEREST_MODAL" :isPolygonSelected="aoi !== null && aoi_file === null")
.wrapper
  #home(v-if="!loading_result")
    CardDark
      .card-content.text-3xl.py-3.items-center.flex.flex-col
        .row-2
          CardText.row-item.text-right.px-5(value="Algorithm")
          CardText.row-item.text-ml-blue.text-center(value="RandomForest")
        .row-2
          CardText.row-item.text-right.px-5(value="Date of Interest")
          DatePicker.row-item(id="doi-select" value="Select" @selected="selectDoi" :completed="doi !== null")
        .row-2
          CardText.row-item.text-right.px-5(value="Area of Interest")
          .row-item
            CardButton(
              id="aoi-button"
              full-w
              :value="aoi !== null ? 'Modify' : 'Choose'"
              :completed="aoi !== null"
              :error="errors.aoi"
              @click="aoi_modal_handler.open()"
            )
            .uploaded-file.mt-1.flex.justify-center(v-if="aoi_file")
              small.text-ellipsis.whitespace-nowrap.overflow-hidden(v-text="aoi_file.name")
              button.delete-file-button(type="button" :class="'hover:text-ml-red'" @click="deleteAoiFile")
                mdicon(name="window-close")
        .row-2
          CardText.row-item.text-right.px-5(value="Training Data")
          FileUpload.row-item(
            id="td-upload"
            value="Upload"
            show-uploaded-file
            :types="['json', 'geojson']"
            :completed="td !== null"
            :error="errors.td"
            @uploaded="uploadedTD"
            @deleted="reset_td")
        .row-2
          CardText.row-item.text-right.px-5(value="Hyperparameter")
          CardButton.row-item(id="hp-button" value="Tune")
        .row-2
          CardText.row-item.text-right.px-5(value="Resolution")
          CardButton.row-item(id="rs-button" value="Select")
        .row-2.row-2-b
          .px-5.row-item
            button.demo-button.transition-2(id="demo-button" v-text="'Demo'")
          button.row-item.calculate-button.font-semibold.transition-2(id="calc-button" v-text="'Calculate'" @click="start_request")
  template(v-else)
    .loading.flex.flex-col
      .lds-roller
        div
        div
        div
        div
        div
        div
        div
        div
      .text-ml-text.mt-5 Loading ...
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from "vue";
import { useModal } from "@/composables/use-modal";
import { ModalIds } from "@/enums";
import CardDark from "@/components/base/CardDark.vue";
import CardButton from "@/components/base/CardButton.vue";
import CardText from "@/components/base/CardText.vue";
import DatePicker from "@/components/form/DatePicker.vue";
import FileUpload from "@/components/form/FileUpload.vue";
import OlMapTifBlob from "@/components/map/OlMapTifBlob.vue";
import AreaOfInterestModal from "@/components/modals/home/area-of-interest.modal.vue";
import type { SubmitPayload } from "@/types/handlers";
import { fileToFeatureCollection, payloadToPolygonFeature } from "../helper/geojson";
import type { Polygon, FeatureCollection, Feature } from "@/types/geojson";
import { useApi } from "@/composables/use-api";
import { useBlobResult } from "@/composables/use-blob-result";
import router from "@/router";

export default defineComponent({
  components: {
    CardDark,
    CardButton,
    CardText,
    DatePicker,
    FileUpload,
    AreaOfInterestModal,
    OlMapTifBlob,
  },
  setup() {
    const api = useApi();

    const blobResult = useBlobResult();

    const doi: Ref<Date | null> = ref(null);
    const aoi: Ref<Feature<Polygon> | null> = ref(null);
    const td: Ref<FeatureCollection | null> = ref(null);

    const errors = ref({
      aoi: false,
      td: false,
    });

    const aoi_file = ref<File | null>();

    const loading_result: Ref<boolean> = ref(false);

    const aoi_submit = async (payload: SubmitPayload) => {
      errors.value.aoi = false;
      deleteAoiFile();
      aoi.value = await payloadToPolygonFeature(payload);
      (document.getElementById("aoi-upload") as HTMLInputElement).value = "";
      if (payload instanceof File) aoi_file.value = payload;
      if (!aoi.value)  errors.value.aoi = true;
    };
    const aoi_modal_handler = useModal(ModalIds.HOME__AREA_OF_INTEREST_MODAL, aoi_submit);

    const deleteAoiFile = () => {
      aoi.value = null;
      aoi_file.value = null;
      errors.value.aoi = false;
    };

    const selectDoi = (date: Date) => {
      doi.value = date;
    };

    const uploadedTD = async (file: File) => {
      errors.value.td = false;
      td.value = await fileToFeatureCollection(file);
      (document.getElementById("td-upload") as HTMLInputElement).value = "";
      if (!td.value) errors.value.td = true;
    };

    const reset_td = () =>{
      td.value = null;
      errors.value.td = false;
    };

    const start_request = async () => {
      if (aoi.value) {
        loading_result.value = true;
        const res = await api.pre_release_request(aoi.value);
        const blob = new Blob([res.data], { type: 'image/tiff' });

        blobResult.setResult(blob);
        router.push("/result");
      }
    };

    return {
      aoi_modal_handler,
      ModalIds,
      aoi_file,
      deleteAoiFile,
      selectDoi,
      uploadedTD,
      reset_td,
      doi,
      aoi,
      td,
      errors,
      start_request,
      loading_result,
    };
  },
});
</script>

<style scoped>
@import '@/assets/spinner.css';

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
