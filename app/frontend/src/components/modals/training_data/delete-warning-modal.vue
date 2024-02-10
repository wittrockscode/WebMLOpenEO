<template lang="pug">
Modal(:handler="handler" title="Change Mode" :id="id")
  #delete-warning.flex.flex-col
    template(v-if="type === 'upload'")
      p Uploading data will delete the current polygons. Are you sure you want to continue?
    template(v-else-if="type === 'draw'")
      p Drawing Polygons will delete the current uploaded data. Are you sure you want to continue?
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
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
  setup(props) {
    const type = ref("upload");
    props.handler.onOpen((newType: string) => {
      type.value = newType;
      props.handler.setPayload(newType);
    });

    return { type };
  },
});
</script>
