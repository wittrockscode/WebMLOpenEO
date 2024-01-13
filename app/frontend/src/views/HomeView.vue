<template lang="pug">
AreaOfInterestModal(:handler="aoi_modal_handler" :id="ModalIds.HOME__AREA_OF_INTEREST_MODAL" :isPolygonSelected="aoi !== null && aoi_file === null")
HyperparameterModal(:handler="hyperparameter_modal_handler" :id="ModalIds.HOME__HYPERPARAMETER_MODAL")
TrainingDataModal(:handler="td_modal_handler" :id="ModalIds.HOME__TRAINING_DATA_MODAL")
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
          .row-item
            CardButton(
              id="td-button"
              full-w
              :value="td !== null ? 'Modify' : 'Choose'"
              :completed="td !== null"
              :error="errors.td"
              @click="td_modal_handler.open()"
            )
            .uploaded-file.mt-1.flex.justify-center(v-if="td_file")
              small.text-ellipsis.whitespace-nowrap.overflow-hidden(v-text="td_file.name")
              button.delete-file-button(type="button" :class="'hover:text-ml-red'" @click="deleteTdFile")
                mdicon(name="window-close")
        .row-2
          CardText.row-item.text-right.px-5(value="Hyperparameter")
          CardButton.row-item(
            id="hp-button"
            value="Tune"
            full-w
            @click="hyperparameter_modal_handler.open()"
          )
        .row-2
          CardText.row-item.text-right.px-5(value="Resolution")
          DropdownSelect.row-item(
            id="rs-button"
            :values="[{ label: '10x10', value: 10 }, { label: '30x30', value: 30 }, { label: '60x60', value: 60 }]"
            :selected="1"
          )
        .row-2.row-2-b
          .px-5.row-item
            button.demo-button.transition-2(id="demo-button" v-text="'Demo'" @click="start_demo")
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
import DropdownSelect from "@/components/form/DropdownSelect.vue";
import OlMapTifBlob from "@/components/map/OlMapTifBlob.vue";
import AreaOfInterestModal from "@/components/modals/home/area-of-interest.modal.vue";
import HyperparameterModal from "@/components/modals/home/hyperparameter.modal.vue";
import TrainingDataModal from "@/components/modals/home/training-data.modal.vue";
import type { SubmitPayload } from "@/types/handlers";
import { fileToFeatureCollection, payloadToPolygonFeature, payloadToFeatureCollection } from "../helper/geojson";
import type { Polygon, FeatureCollection, Feature } from "@/types/geojson";
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
    DropdownSelect,
    HyperparameterModal,
    TrainingDataModal,
  },
  setup() {
    const doi: Ref<Date[] | null> = ref(null);
    const aoi: Ref<Feature<Polygon> | null> = ref(null);
    const td: Ref<FeatureCollection | null> = ref(null);

    const errors = ref({
      aoi: false,
      td: false,
    });

    const aoi_file = ref<File | null>();
    const td_file = ref<File | null>();

    const loading_result: Ref<boolean> = ref(false);

    const aoi_submit = async (payload: SubmitPayload) => {
      errors.value.aoi = false;
      deleteAoiFile();
      aoi.value = await payloadToPolygonFeature(payload);
      (document.getElementById("aoi-upload") as HTMLInputElement).value = "";
      if (payload instanceof File) aoi_file.value = payload;
      if (!aoi.value)  errors.value.aoi = true;
    };

    const hyperparameter_submit = () => {

    };

    const td_submit = async (payload: SubmitPayload) => {
      errors.value.td = false;
      deleteTdFile();
      td.value = await payloadToFeatureCollection(payload);
      (document.getElementById("td-upload") as HTMLInputElement).value = "";
      if (payload instanceof File) td_file.value = payload;
      if (!td.value)  errors.value.td = true;
    };

    const aoi_modal_handler = useModal(ModalIds.HOME__AREA_OF_INTEREST_MODAL, aoi_submit);
    const hyperparameter_modal_handler = useModal(ModalIds.HOME__HYPERPARAMETER_MODAL, hyperparameter_submit);
    const td_modal_handler = useModal(ModalIds.HOME__TRAINING_DATA_MODAL, td_submit);

    const deleteAoiFile = () => {
      aoi.value = null;
      aoi_file.value = null;
      errors.value.aoi = false;
    };

    const deleteTdFile = () => {
      td.value = null;
      td_file.value = null;
      errors.value.td = false;
    };

    const selectDoi = (dates: Date[]) => {
      doi.value = dates;
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
        // TODO
        router.push("/result");
      }
    };

    const start_demo = () => {
      //TODO
    };

    return {
      aoi_modal_handler,
      ModalIds,
      aoi_file,
      td_file,
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
      hyperparameter_modal_handler,
      td_modal_handler,
      start_demo,
      deleteTdFile,
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
