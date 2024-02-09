<template lang="pug">
Modal(:handler="handler" title="Create a new Class" :id="id")
  #edit-classes
    label.mr-10(for="new-class-input" v-text="'New class name:'")
    TextInput(id="new-class-input" placeholder="enter class name" v-model="textValue")
  label.text-ml-red.ml-1.text-sm.font-semibold(v-if="errors.new_class" v-text="errors.new_class_error_text" for="new-class-input")
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "@/components/base/Modal.vue";
import TextInput from "@/components/form/TextInput.vue";
import type { PropType } from "vue";
import type { useModal } from "@/composables/use-modal";

export default defineComponent({
  components: {
    Modal,
    TextInput,
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
    const textValue = ref("");
    const errors = ref({
      new_class: false,
      new_class_error_text: "",
    });

    props.handler.onBeforeSubmit(() => {
      errors.value.new_class = false;
      errors.value.new_class_error_text = "";
      if (textValue.value === "") {
        errors.value.new_class = true;
        errors.value.new_class_error_text = "Class name cannot be empty";
        return false;
      }

      if (!/^[a-z0-9_]+$/i.test(textValue.value)) {
        errors.value.new_class = true;
        errors.value.new_class_error_text = "Class name can only contain letters, numbers and underscores";
        return false;
      }

      return true;
    });

    props.handler.onSubmit(() => {
      props.handler.setPayload(textValue.value);
      textValue.value = "";
    });
    return { textValue, errors };
  },
});
</script>
