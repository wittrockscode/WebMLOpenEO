<template lang="pug">
.map-container
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
    ol-webgl-tile-layer(v-if="blob" :style="trueColor")
      ol-source-geo-tiff(
        :sources="[{ blob }]"
      )
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import { defineComponent } from "vue";
import { useBlobResult } from "@/composables/use-blob-result";
import router from "@/router";

export default defineComponent({
  setup() {
    const center = ref([848933.5687385835, 6793022.627243362]);
    const projection = ref('EPSG:3857');
    const zoom = ref(15);
    const rotation = ref(0);

    const blobResult = useBlobResult();

    onMounted(() => {
      if (blobResult.result === null) router.push("/");
    });

    const max = 3000;
    function normalize(value: any) {
      return ["/", value, max];
    }

    const red = normalize(["band", 1]);
    const green = normalize(["band", 2]);
    const blue = normalize(["band", 3]);

    const trueColor = ref({
      color: ["array", red, green, blue, 1],
      gamma: 1.1,
    });

    return { center, projection, zoom, rotation, trueColor, blob: blobResult.result };
  },
});
</script>

<style scoped>
.map-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
