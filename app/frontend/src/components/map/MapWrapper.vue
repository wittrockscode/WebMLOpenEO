<template lang="pug">
.map-wrapper.flex
  template(v-if="isReady")
    MapLegend(:args-list="argsListLegend" :colors-array="colorsArray" @toggleMap="showTif = !showTif" @toggleConfidences="showConfidences = !showConfidences")
    OlMapTif(:args-list="argsList" :colors-array="colorsArray" :showTif="showTif" :showConfidences="showConfidences")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { nextTick, onMounted, ref } from "vue";
import { fromBlob, fromUrl } from "geotiff";
import OlMapTif from "./OlMapTif.vue";
import MapLegend from "./MapLegend.vue";
import { useBlobResult } from "@/composables/use-blob-result";

export default defineComponent({
  components: {
    OlMapTif,
    MapLegend,
  },
  setup() {
    const { result, class_map } = useBlobResult();

    const minBandVal = ref(1);
    const maxBandVal = ref(1);
    const colorsArray = ref<string[]>([]);
    const argsList = ref<number[]>([]);
    const argsListLegend = ref<string[]>([]);
    const isReady = ref(false);

    const showTif = ref(true);
    const showConfidences = ref(false);

    const getUniqueValues = (arr: Array<number>) => {
      return arr.filter((v, i, a) => a.indexOf(v) === i);
    };

    function hslToHex(h: number, s: number, l: number) {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    }

    const getUniqueColors = (colors: number) => {
      const colorArray: string[] = [];
      const partial_color_range = 360 / (colors);
      [...Array(colors)].map((_, i) => {
        colorArray.push(hslToHex(partial_color_range * i, 75, 50));
      });

      return colorArray;
    };

    onMounted(async () => {
      //if (result.value === null) return;
      const c_map = ["wasser", "wald", "stadt", "feld"];
      const tiff = await fromUrl('big.tif');
      const image = await tiff.getImage();
      const rasters = await image.readRasters();
      const typed_arr = rasters[0]! as import("geotiff").TypedArray;
      const arr = Array.from(typed_arr);
      minBandVal.value = Math.min(...arr);
      maxBandVal.value = Math.max(...arr);
      const uniqueVals = getUniqueValues(arr).sort();
      colorsArray.value = getUniqueColors(uniqueVals.length);
      uniqueVals.forEach((v, i) => {
        argsList.value.push(v);
        argsListLegend.value.push(c_map[v] ?? "");
        argsList.value.push(i);
        argsListLegend.value.push("");
      });
      argsList.value.push(0);
      argsListLegend.value.push(`${0}`);
      isReady.value = true;
      await nextTick();
    });
    return { isReady, colorsArray, argsList, argsListLegend, showTif, showConfidences };
  },
});
</script>

<style scoped>
.map-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>