<template lang='pug'>
header#header
  .content-group.flex.justify-center.text-ml-dark.bg-ml-light.py-2.gap-x-10.items-center
    HeaderLinkIcon(icon="home" path="/")
    h1#app-name.headline.text-6xl.font-bold SENTINEL-ML
    HeaderLinkIcon(icon="help-circle" path="/")
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import HeaderLinkIcon from '@/components/base/HeaderLinkIcon.vue';

export default defineComponent({
  components: {
    HeaderLinkIcon
  },
  setup() {

    return {  };
  },
});
</script>
