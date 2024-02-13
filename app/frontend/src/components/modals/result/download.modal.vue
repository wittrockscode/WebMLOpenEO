<template lang="pug">
Modal(:handler="handler" title="Download TIF" :id="id" submitText="Download")
  #download-tif
    p.p-4.text-xl.text-justify.font-semibold This will download the classification data, including the final TIF and the class mapping. The class map is necessary as TIF can only store integers. The class map is a JSON file containing a class name for each integer. This will download two seperate files.
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "@/components/base/Modal.vue";
import type { PropType } from "vue";
import type { useModal } from "@/composables/use-modal";

export default defineComponent({
  components: {
    Modal,
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
  },
  setup() {

    return { };
  },
});
</script>

<style scoped>
#download-tif {
  max-width: 80vw;
  width: 50rem;
}
</style>