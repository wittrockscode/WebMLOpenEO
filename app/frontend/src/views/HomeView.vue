<template lang="pug">
#home
  CardDark.mt-32
    .card-content.grid.grid-cols-2.grid-rows-6.text-3xl.py-3.items-center.gap-7
      CardText(value="Algorithm" position="right")
      CardText.text-ml-blue(value="RandomForest")
      CardText(value="Date of Interest" position="right")
      CardButton(id="doi-button" value="Select")
      CardText(value="Area of Interest" position="right")
      CardButton(id="aoi-button" value="Choose")
      CardText(value="Training Data" position="right")
      CardButton(id="td-button" value="Upload")
      CardText(value="Hyperparameter" position="right")
      CardButton(id="hp-button" value="Tune")
      CardText(value="Resolution" position="right")
      CardButton(id="rs-button" value="Select")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CardDark from "@/components/base/CardDark.vue";
import CardButton from "@/components/base/CardButton.vue";
import CardText from "@/components/base/CardText.vue";

export default defineComponent({
  components: {
    CardDark,
    CardButton,
    CardText,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
