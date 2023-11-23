<template lang="pug">
AreaOfInterestModal(:handler="aoi_modal_handler" :id="ModalIds.HOME__AREA_OF_INTEREST_MODAL")
TrainingDataModal(:handler="td_modal_handler" :id="ModalIds.HOME__TRAINING_DATA_MODAL")
#home
  CardDark.mt-32
    .card-content.grid.grid-cols-2.grid-rows-6.text-3xl.py-3.items-center.gap-7
      CardText(value="Algorithm" position="right")
      CardText.text-ml-blue(value="RandomForest")
      CardText(value="Date of Interest" position="right")
      CardButton(id="doi-button" value="Select")
      CardText(value="Area of Interest" position="right")
      CardButton(id="aoi-button" value="Choose" @click="aoi_modal_handler.open()")
      CardText(value="Training Data" position="right")
      CardButton(id="td-button" value="Upload" @click="td_modal_handler.open()")
      CardText(value="Hyperparameter" position="right")
      CardButton(id="hp-button" value="Tune")
      CardText(value="Resolution" position="right")
      CardButton(id="rs-button" value="Select")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useModal } from "@/composables/use-modal";
import { ModalIds } from "@/enums";
import CardDark from "@/components/base/CardDark.vue";
import CardButton from "@/components/base/CardButton.vue";
import CardText from "@/components/base/CardText.vue";
import AreaOfInterestModal from "@/components/modals/home/area-of-interest.modal.vue";
import TrainingDataModal from "@/components/modals/home/training-data.modal.vue";

export default defineComponent({
  components: {
    CardDark,
    CardButton,
    CardText,
    AreaOfInterestModal,
    TrainingDataModal,
  },
  setup() {
    const aoi_modal_handler = useModal(ModalIds.HOME__AREA_OF_INTEREST_MODAL);

    const td_modal_handler = useModal(ModalIds.HOME__TRAINING_DATA_MODAL);

    return { aoi_modal_handler, td_modal_handler, ModalIds };
  },
});
</script>

<style scoped></style>
