<template lang="pug">
.map-legend.flex.flex-col.justify-between.text-ml-text.mx-5
  .control-group.flex-col
    h4.text-2xl.mb-2.font-semibold Legend
    .legend-item.flex.justify-start.mb-2(v-for="(color, index) in colorsArray" :key="colors")
      span.w-4.mr-1(:style="{backgroundColor: color}")
      p(:class="'whitespace-nowrap'") {{ `: ${argsList[index * 2]}` }}
  .control-group.mb-5
    button.text-xl.w-full(type="button" @click="$emit('toggleConfidences')" class="btn btn-secondary") Toggle Confidences
    button.text-xl.w-full(type="button" @click="$emit('toggleMap')" class="btn btn-secondary") Toggle Layer
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    colorsArray: {
      type: Array,
      default: () => [],
    },
    argsList: {
      type: Array,
      default: () => [],
    },
  },
  setup() {

    return { };
  },
});
</script>

<style scoped>
.map-legend {
  margin-top: 7rem;
}
</style>