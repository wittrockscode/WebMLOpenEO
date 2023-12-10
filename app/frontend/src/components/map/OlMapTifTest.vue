<template lang="pug">
ol-map(
  :loadTilesWhileAnimating="true"
  :loadTilesWhileInteracting="true"
  style="height:50vh;width: 50vw;"
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
  ol-webgl-tile-layer(:style="tifColors")
    ol-source-geo-tiff(
      :normalize="false"
      :sources="[{url: 'aoi_grid2.tif'}]"
    )
</template>

<script lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { defineComponent } from "vue";
import { fromUrl } from "geotiff";

export default defineComponent({
  setup() {
    const center = ref([848933.5687385835, 6793022.627243362]);
    const projection = ref('EPSG:3857');
    const zoom = ref(15);
    const rotation = ref(0);

    const minBandVal = ref(1);
    const maxBandVal = ref(1);

    const tifColors = ref({
      color: [
        'palette',
        [
          'match',
          ['band', 1], //Band 1
          1, //Match 1 -> index 1
          1,
          2, //Match 2 -> index 2
          2,
          0, //Fallback index (if no match was detected)
        ],
        ['#000000', '#D54433', '#4CC9F0'], //Color array
      ],
    });

    onMounted(async () => {
      const tiff = await fromUrl("aoi_grid2.tif");
      const image = await tiff.getImage();
      const rasters = await image.readRasters();
      const typed_arr = rasters[0]! as import("geotiff").TypedArray;
      const arr = Array.from(typed_arr);

      minBandVal.value = Math.min(...arr);
      maxBandVal.value = Math.max(...arr);

      await nextTick();
    });

    return { center, projection, zoom, rotation, tifColors };
  },
});
</script>

<style scoped></style>
