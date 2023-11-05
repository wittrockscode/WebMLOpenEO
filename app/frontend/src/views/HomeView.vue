<template lang="pug">
main
  #map
    OlMap
</template>

<script lang="ts">
import OlMap from '@/components/OlMap.vue';
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    OlMap,
  },
  setup() {
    return {

    };
  },
});
</script>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
</style>
