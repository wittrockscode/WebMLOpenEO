<template lang="pug">
button.rounded.bg-ml-dark.text-ml-text.p-1.transition-2.hover-shadow(
  :id="id"
  :class="'hover:bg-ml-blue hover:text-ml-black'"
  v-text="value"
  @click="$emit('click')"
)
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  emits: ["click"],
  setup() {
    return {};
  },
});
</script>
