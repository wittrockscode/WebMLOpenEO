<template lang="pug">
Modal(:handler="handler" title="Create a new Class" :id="id")
  #edit-classes
    label.mr-10(for="new-class-input" v-text="'New class name:'")
    TextInput(id="new-class-input" placeholder="enter class name" @input="value => updateValue(value)")
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "@/components/base/Modal.vue";
import TextInput from "@/components/form/TextInput.vue";
import type { PropType } from "vue";
import type { ModalHandler } from "@/types/AppTypes";

export default defineComponent({
  components: {
    Modal,
    TextInput,
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
  setup(props) {
    const value = ref("");
    const updateValue = (newValue: string) => {
      value.value = newValue;
      props.handler.setPayload(value.value);
    };

    return { updateValue };
  },
});
</script>
