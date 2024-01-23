<template lang="pug">
Modal(:handler="handler" title="Create a new Class" :id="id")
  #edit-classes
    label.mr-10(for="new-class-input" v-text="'New class name:'")
    TextInput(id="new-class-input" placeholder="enter class name" v-model="textValue")
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
    const textValue = ref("");

    props.handler.onSubmit(() => {
      props.handler.setPayload(textValue.value);
      textValue.value = "";
    });
    return { textValue };
  },
});
</script>
