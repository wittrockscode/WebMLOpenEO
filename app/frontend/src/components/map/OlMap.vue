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
    const center = ref([848933.5687385835, 6793022.627243362]);
    const projection = ref("EPSG:3857");
    const zoom = ref(15);
    const rotation = ref(0);

    return { center, projection, zoom, rotation };
  },
});
</script>

<style scoped></style>
