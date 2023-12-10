<template lang="pug">
AreaOfInterestModal(:handler="aoi_modal_handler" :id="ModalIds.HOME__AREA_OF_INTEREST_MODAL")
#home
  CardDark.mt-32
    .card-content.text-3xl.py-3.items-center.flex.flex-col
      .row-2
        CardText.row-item.text-right.px-5(value="Algorithm")
        CardText.row-item.text-ml-blue.text-center(value="RandomForest")
      .row-2
        CardText.row-item.text-right.px-5(value="Date of Interest")
        DatePicker.row-item(id="doi-select" value="Select")
      .row-2
        CardText.row-item.text-right.px-5(value="Area of Interest")
        CardButton.row-item(id="aoi-button" value="Choose" @click="aoi_modal_handler.open()")
      .row-2
        CardText.row-item.text-right.px-5(value="Training Data")
        FileUpload.row-item(id="td-upload" value="Upload" :types="['json', 'geojson']")
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
import { defineComponent } from "vue";
import { useModal } from "@/composables/use-modal";
import { ModalIds } from "@/enums";
import CardDark from "@/components/base/CardDark.vue";
import CardButton from "@/components/base/CardButton.vue";
import CardText from "@/components/base/CardText.vue";
import DatePicker from "@/components/form/DatePicker.vue";
import FileUpload from "@/components/form/FileUpload.vue";
import AreaOfInterestModal from "@/components/modals/home/area-of-interest.modal.vue";

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
    const aoi_modal_handler = useModal(ModalIds.HOME__AREA_OF_INTEREST_MODAL);

    return { aoi_modal_handler, ModalIds };
  },
});
</script>

<style scoped></style>
