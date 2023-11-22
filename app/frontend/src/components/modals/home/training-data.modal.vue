<template lang="pug">
Modal(:handler="handler" title="Training Data" :id="id")
  h1 TODO: Training data modal
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "@/components/base/Modal.vue";
import type { PropType } from "vue";

export default defineComponent({
  components: {
    Modal,
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
