<template lang="pug">
.container.bg-ml-black.text-ml-text.rounded.mx-auto.p-4.max-w-2xl
  slot
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>
