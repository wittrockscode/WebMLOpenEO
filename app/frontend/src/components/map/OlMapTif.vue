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
    ol-webgl-tile-layer(:style="tifColors" v-if="showTif && !showConfidences")
      ol-source-geo-tiff(
        :normalize="false"
        :sources="[{blob}]"
        ref="tifSourceRef"
      )
    ol-webgl-tile-layer(:style="greyscaleColors" v-if="showTif && showConfidences")
      ol-source-geo-tiff(
        :normalize="false"
        :sources="[{blob}]"
      )
</template>

<script lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { defineComponent } from "vue";
import { useBlobResult } from "@/composables/use-blob-result";
import { Map as OLMap } from 'ol';
import { fromUrl } from "geotiff";

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
    showTif: {
      type: Boolean,
      default: true,
    },
    showConfidences: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const center = ref([848933.5687385835, 6793022.627243362]);
    const projection = ref('EPSG:3857');
    const zoom = ref(15);
    const rotation = ref(0);

    const { result } = useBlobResult();

    const blob = ref<Blob | null>(null);

    const tifSourceRef = ref<any>(null);
    const mapRef = ref<any>(null);

    // argument array is now mapped to the color array,
    // resulting in a color for each class
    const tifColors = ref({
      color: [
        'palette',
        [
          'match',
          ['band', 1],
          ...props.argsList,
        ],
        props.colorsArray,
      ],
    });

    const greyscaleColors = ref({
      color: [
        'interpolate',
        ['linear'],
        ['band', 4],
        0,
        '#ffffff',
        1,
        '#000000',
      ],
    });

    const fitToTif = (extend: number[]) => {
      if(mapRef.value?.map !== (null || undefined)){
        const map: OLMap = mapRef.value!.map!;
        map.getView().fit(extend, { size: map.getSize(), padding: [50, 50, 50, 50] });
      }
    };

    onMounted(async () => {
      if (result.value === null) return;

      const urlOb = await fromUrl(URL.createObjectURL(result.value));
      const image = await urlOb.getImage();
      const extend = image.getBoundingBox();

      blob.value = result.value;
      await nextTick();
      fitToTif(extend);
    });

    return { center, projection, zoom, rotation, tifColors, blob, greyscaleColors, mapRef, tifSourceRef };
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
