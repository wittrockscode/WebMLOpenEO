<template lang="pug">
Modal(:handler="handler" title="Edit Classes" :id="id" hide-footer)
  #edit-classes.flex.flex-col
    template(v-if="trainingDataClasses.length > 0")
      .class-item.my-1(v-for="(name, index) in trainingDataClasses" :key="name")
        .flex.justify-between
          p(v-text="name")
          button.text-ml-red(type="button" @click="deleteClass(name)")
            mdicon(name="trash-can")
    template(v-else)
      p Nothing here yet...
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
    trainingDataClasses: {
      type: Array as PropType<string[]>,
      required: false,
    },
  },
  emits: ["deleteClass"],
  setup(props, { emit }) {
    const deleteClass = (name: string) => {
      emit("deleteClass", name);
    };
    return { deleteClass };
  },
});
</script>
