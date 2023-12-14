<template lang="pug">
AreaOfInterestModal(:handler="aoi_modal_handler" :id="ModalIds.HOME__AREA_OF_INTEREST_MODAL" :isPolygonSelected="aoi !== null && aoi_file === null")
#home
  CardDark.mt-32
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
          CardButton(id="aoi-button" value="Choose" @click="aoi_modal_handler.open()" full-w :completed="aoi !== null")
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
        button.row-item.calculate-button.font-semibold.transition-2(id="calc-button" v-text="'Calculate'")
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
import AreaOfInterestModal from "@/components/modals/home/area-of-interest.modal.vue";
import type { SubmitPayload } from "@/types/handlers";
import { payloadToPolygon, fileToFeatureCollection } from "../helper/geojson";
import type { Polygon, FeatureCollection } from "@/types/geojson";

export default defineComponent({
  components: {
    CardDark,
    CardButton,
    CardText,
    DatePicker,
    FileUpload,
    AreaOfInterestModal,
  },
  setup() {
    const doi: Ref<Date | null> = ref(null);
    const aoi: Ref<Polygon | null> = ref(null);
    const td: Ref<FeatureCollection | null> = ref(null);

    const aoi_file = ref<File | null>();

    const aoi_submit = async (payload: SubmitPayload) => {
      deleteAoiFile();
      if (payload instanceof File) aoi_file.value = payload;
      aoi.value = await payloadToPolygon(payload);
    };
    const aoi_modal_handler = useModal(ModalIds.HOME__AREA_OF_INTEREST_MODAL, aoi_submit);

    const deleteAoiFile = () => {
      aoi.value = null;
      aoi_file.value = null;
    };

    const selectDoi = (date: Date) => {
      doi.value = date;
    };

    const uploadedTD = async (file: File) => {
      td.value = await fileToFeatureCollection(file);
    };

    const reset_td = () => td.value = null;

    return { aoi_modal_handler, ModalIds, aoi_file, deleteAoiFile, selectDoi, uploadedTD, reset_td, doi, aoi, td };
  },
});
</script>

<style scoped></style>
