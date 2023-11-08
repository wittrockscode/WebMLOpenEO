<template lang='pug'>
.header-link-icon
  RouterLink(:to="path").link-underline
    mdicon(:name="icon" size="40" class="hover:text-ml-orange ease-in-out duration-200").cursor-pointer
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  setup() {

    return { };
  },
});
</script>
