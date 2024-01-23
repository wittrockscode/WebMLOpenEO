<template lang="pug">
input.rounded.bg-ml-dark.text-ml-text.p-1.transition-2.hover-shadow.form-item.mb-2(
  :type="type"
  :id="id"
  :placeholder="placeholder"
  @input="$emit('update:modelValue', $event.target.value)"
  :value="modelValue"
)
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number],
    },
    type: {
      type: String,
      deafult: "text",
    },
    id: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup() {

    return { };
  },
});
</script>
