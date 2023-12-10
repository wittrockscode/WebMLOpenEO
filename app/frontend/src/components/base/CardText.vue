<template lang="pug">
p.card-text.font-semibold(v-text="value")
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup() {
    return { };
  },
});
</script>
