<template lang="pug">
Modal(:handler="handler" title="Area of Interest" :id="id")
  h1 TODO: Area of Interest modal
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
