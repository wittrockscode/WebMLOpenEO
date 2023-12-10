<template lang="pug">
Modal(:handler="handler" title="Area of Interest" :id="id")
  #aoi-map
    OlMap
  .control-group.flex.justify-between.w-full.mt-4
    CardButton(id="draw-button" value="Select on map")
    strong(v-text="'or'")
    FileUpload(id="td-upload" value="Upload GeoJSON" :types="['json', 'geojson']" input-class="file-upload-label-full")

</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "@/components/base/Modal.vue";
import type { PropType } from "vue";
import type { ModalHandler } from "@/types/handlers";
import OlMap from "@/components/map/OlMap.vue";
import CardButton from "@/components/base/CardButton.vue";
import FileUpload from "@/components/form/FileUpload.vue";

export default defineComponent({
  components: {
    Modal,
    OlMap,
    CardButton,
    FileUpload,
  },
  props: {
    handler: {
      type: Object as PropType<ModalHandler>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  setup() {

    return {};
  },
});
</script>

<style scoped>
#aoi-map {
  width: 50vw;
  height: 50vh;
  display: block;
}
</style>