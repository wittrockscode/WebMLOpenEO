<template lang="pug">
input.rounded.bg-ml-dark.text-ml-text.p-1.transition-2.hover-shadow.form-item.mb-2(
  :type="type"
  :id="id"
  :placeholder="placeholder"
  @input="event => $emit('input', event.target.value)"
)
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
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
  emits: ["input"],
  setup() {

    return { };
  },
});
</script>
