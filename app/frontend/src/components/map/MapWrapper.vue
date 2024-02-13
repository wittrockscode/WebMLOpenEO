<template lang="pug">
DownloadModal(:handler="downloadHandler" :id="ModalIds.RESULT__DOWNLOAD_MODAL")
.map-wrapper.flex
  template(v-if="isReady")
    MapLegend(
      :args-list="argsListLegend"
      :colors-array="colorsArray"
      :confidences="showConfidences"
      :is-demo="is_demo"
      @toggleMap="showTif = !showTif"
      @toggleConfidences="showConfidences = !showConfidences"
      @download-model="downloadModel"
      @download-tif="downloadHandler.open()"
      @download-demo-payload="downloadDemoPayload"
    )
    OlMapTif(:args-list="argsList" :colors-array="colorsArray" :showTif="showTif" :showConfidences="showConfidences")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { nextTick, onMounted, ref } from "vue";
import { fromBlob } from "geotiff";
import OlMapTif from "./OlMapTif.vue";
import MapLegend from "./MapLegend.vue";
import { useBlobResult } from "@/composables/use-blob-result";
import { useApi } from "@/composables/use-api";
import { useModal } from "@/composables/use-modal";
import { ModalIds } from "@/enums";
import DownloadModal from "@/components/modals/result/download.modal.vue";

export default defineComponent({
  components: {
    OlMapTif,
    MapLegend,
    DownloadModal,
  },
  setup() {
    const { result, class_map, model_id, is_demo } = useBlobResult();
    const { get_model_request, get_demo_data_request } = useApi();

    const colorsArrayColorblind = [
      "#490092",
      "#22cf22",
      "#db6d00",
      "#009999",
      "#b66dff",
      "#004949",
      "#006ddb",
      "#171723",
      "#ff6db6",
      "#920000",
      "#8f4e00",
      "#ffdf4d",
      "#ffffff",
      "#676767",
      "#252525",
      "#000000",
    ];

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
        if (i >= 0 && i < colorsArrayColorblind.length) colorArray.push(colorsArrayColorblind[i]!);
        else colorArray.push(hslToHex(partial_color_range * i, 75, 50));
      });

      return colorArray;
    };

    const downloadHandler = useModal<Boolean>(
      ModalIds.RESULT__DOWNLOAD_MODAL,
      () => {
        downloadTif();
      },
      () => {},
      110,
    );

    onMounted(async () => {
      if (result.value === null) return;

      //extract raster data from tiff
      const tiff = await fromBlob(result.value);
      const image = await tiff.getImage();
      const rasters = await image.readRasters();

      //get the classification data from the rasters
      const typed_arr = rasters[0]! as import("geotiff").TypedArray;
      const classification_array = Array.from(typed_arr);

     //create unique values array and assign colors to each value
      const uniqueVals = getUniqueValues(classification_array).sort();
      colorsArray.value = getUniqueColors(uniqueVals.length);

      //create argument list for the color mapping in openlayers and the legend
      uniqueVals.forEach((v, i) => {
        //array has structure [value, index, value, index, ...]
        argsList.value.push(v);
        argsList.value.push(i);

        //legend array has structure [classMapValue[v], "", classMapValue[v], "", ...]
        argsListLegend.value.push(class_map.value[v] ?? "");
        argsListLegend.value.push("");
      });

      //append fallback 0
      argsList.value.push(0);
      argsListLegend.value.push(`${0}`);
      isReady.value = true;
      await nextTick();
    });

    const downloadTif = () => {
      if (result.value === null) return;

      const url = window.URL.createObjectURL(result.value);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'result.tif');
      document.body.appendChild(link);
      link.click();

      var fileToSave = new Blob([JSON.stringify(class_map.value)], {
          type: 'application/json'
      });

      const url2 = window.URL.createObjectURL(fileToSave);

      const link2 = document.createElement('a');
      link2.href = url2;
      link2.setAttribute('download', 'class_map.json');
      document.body.appendChild(link2);
      link2.click();



    };

    const downloadModel = async () => {
      if (model_id.value === null) return;

      const model = await get_model_request(model_id.value);

      if ("error" in model || model === null) return;

      const url = window.URL.createObjectURL(new Blob([model]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'model.rds');
      document.body.appendChild(link);
      link.click();
    };

    const downloadDemoPayload = async () => {
      const demo_data_payload = await get_demo_data_request();

      const blob = new Blob([JSON.stringify(demo_data_payload)], { type: "text/json" });
      const link = document.createElement("a");

      link.download = "demo_data_payload.json";
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

      const evt = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
      });

      link.dispatchEvent(evt);
      link.remove();
    };

    return { isReady, colorsArray, argsList, argsListLegend, showTif, showConfidences, is_demo, downloadHandler, ModalIds, downloadModel, downloadTif, downloadDemoPayload };
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