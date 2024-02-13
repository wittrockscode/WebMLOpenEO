<template lang="pug">
.map-legend.flex.flex-col.justify-between.text-ml-text.mx-5(v-if="colorsArray.length > 0 && argsList.length > 0")
  .control-group.flex-col
    h4.text-2xl.mb-2.font-semibold Legend
    .classification(v-if="!confidences" class="sm:text-sm md:text-base lg:text-base")
      .legend-item.flex.justify-start.mb-2(v-for="(color, index) in colorsArray" :key="color")
        span.w-4.mr-1(:style="{backgroundColor: color}")
        p(:class="'whitespace-nowrap'") {{ `: ${argsList[index * 2]}` }}
      br
      p(class="sm:text-sm md:text-base lg:text-base") The colors represent the individual
      p(class="sm:text-sm md:text-base lg:text-base") classes of the classification.
    .confidences(v-else)
      .legend-item.flex.justify-start.mb-2
        span.w-4.mr-1(:style="{backgroundColor: '#000000'}")
        p(:class="'whitespace-nowrap'") ~100% Confidence
      .legend-item.flex.justify-start.mb-2
        span.w-4.mr-1(:style="{backgroundColor: '#7f7f7f'}")
        p(:class="'whitespace-nowrap'") 50% Confidence
      .legend-item.flex.justify-start.mb-2
        span.w-4.mr-1(:style="{backgroundColor: '#ffffff'}")
        p(:class="'whitespace-nowrap'") ~0% Confidence
      br
      p Darker colors represent higher confidence values.
  .group
    .control-group.mb-10
      button.text-xl.w-full(type="button" @click="$emit('toggleConfidences')" class="btn btn-secondary sm:text-sm md:text-base lg:text-base") Toggle Confidences
      button.text-xl.w-full(type="button" @click="$emit('toggleMap')" class="btn btn-secondary sm:text-sm md:text-base lg:text-base") Toggle Layer
    .divider
    .control-group(v-if="isDemo")
      button.text-xl.w-full.btn-download(type="button" @click="$emit('downloadDemoPayload')" class="btn btn-primary sm:text-sm md:text-base lg:text-base") Download demo payload
    .control-group.mb-5
      button.text-xl.w-full.btn-download(type="button" @click="$emit('downloadTif')" class="btn btn-primary sm:text-sm md:text-base lg:text-base") Download TIF
      button.text-xl.w-full.btn-download(type="button" @click="$emit('downloadModel')" class="btn btn-primary sm:text-sm md:text-base lg:text-base") Download Model
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
    confidences: {
      type: Boolean,
      default: false,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggleMap", "toggleConfidences", "downloadTif", "downloadModel", "downloadDemoPayload"],
  setup() {

    return { };
  },
});
</script>

<style scoped>
.map-legend {
  margin-top: 5rem;
  width: 25%;
}

.btn-download {
  border-width: 2px;
  margin-bottom: 0.3rem;
}
</style>