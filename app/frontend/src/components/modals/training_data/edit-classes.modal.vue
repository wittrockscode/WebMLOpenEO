<template lang="pug">
Modal(:handler="handler" title="Edit Classes" :id="id" hide-footer)
  #edit-classes.flex.flex-col
    .class-item.my-1(v-for="(name, index) in trainingDataClasses" :key="name")
      .flex.justify-between
        p(v-text="name")
        button.text-ml-red(type="button" @click="deleteClass(name)")
          mdicon(name="trash-can")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "@/components/base/Modal.vue";
import type { PropType } from "vue";
import type { ModalHandler } from "@/types/AppTypes";

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
