<template lang="pug">
ol-map(
  :loadTilesWhileAnimating="true"
  :loadTilesWhileInteracting="true"
  style="height:100%;width: 100%;"
  ref="mapRef"
)
  ol-view(
    ref="view"
    :center="center"
    :rotation="rotation"
    :zoom="zoom"
    :projection="projection"
  )
  ol-tile-layer
    ol-source-osm
</template>

<script lang="ts">
import { ref } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const center = ref([40, 40]);
    const projection = ref("EPSG:4326");
    const zoom = ref(8);
    const rotation = ref(0);

    return { center, projection, zoom, rotation };
  },
});
</script>

<style scoped>
</style>
