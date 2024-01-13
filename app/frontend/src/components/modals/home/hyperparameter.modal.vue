<template lang="pug">
Modal(:handler="handler" title="Hyperparameters" :id="id")
  .input-group.flex.justify-between.w-full.mt-4.flex-col
    input.rounded.bg-ml-dark.text-ml-text.p-1.transition-2.hover-shadow.form-item.mb-2(type="number" id="ntrees" placeholder="ntrees")
    input.rounded.bg-ml-dark.text-ml-text.p-1.transition-2.hover-shadow.form-item(type="number" id="mtry" placeholder="mtry")
</template>


<script lang="ts">
import { defineComponent } from "vue";
import Modal from "@/components/base/Modal.vue";
import type { PropType } from "vue";
import type { ModalHandler } from "@/types/handlers";

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

    return { };
  },
});
</script>
