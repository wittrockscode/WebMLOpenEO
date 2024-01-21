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
    ol-webgl-tile-layer(:style="tifColors")
      ol-source-geo-tiff(
        :normalize="false"
        :sources="[{blob}]"
      )
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import { defineComponent } from "vue";
import { useBlobResult } from "@/composables/use-blob-result";

export default defineComponent({
  props: {
    colorsArray: {
      type: Array,
      default: () => [],
    },
    argsList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const center = ref([848933.5687385835, 6793022.627243362]);
    const projection = ref('EPSG:3857');
    const zoom = ref(15);
    const rotation = ref(0);

    const { result } = useBlobResult();

    const blob = ref<Blob | null>(null);

    const tifColors = ref({
      color: [
        'palette',
        [
          'match',
          ['band', 1], //Band 1
          ...props.argsList,
        ],
        props.colorsArray, //Color array
      ],
    });

    onMounted(() => {
      if (result.value === null) return;
      blob.value = result.value;
    });

    return { center, projection, zoom, rotation, tifColors, blob };
  },
});
</script>

<style scoped>
.map-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
