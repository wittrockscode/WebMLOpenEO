<template lang="pug">
AreaOfInterestModal(:handler="aoi_modal_handler" :id="ModalIds.HOME__AREA_OF_INTEREST_MODAL" :isPolygonSelected="aoi !== null && aoi_file === null")
HyperparameterModal(:handler="hyperparameter_modal_handler" :id="ModalIds.HOME__HYPERPARAMETER_MODAL")
TrainingDataModal(:handler="td_modal_handler" :id="ModalIds.HOME__TRAINING_DATA_MODAL")
.wrapper
  #home(v-if="!loading_result")
    CardDark
      .card-content.text-3xl.py-3.items-center.flex.flex-col
        .row-2
          CardText.row-item.text-right.px-5(value="Algorithm")
          CardText#model-name.row-item.text-ml-blue.text-center(value="RandomForest")
        .row-2
          CardText.row-item.text-right.px-5(value="Date of Interest")
          DatePicker.row-item(
            id="doi-select"
            placeholder="Select"
            @selected="selectDoi"
            :completed="doi !== null"
            range
            :value="doi"
            :error="errors.doi"
            v-tippy="{ content: 'You can select a range of dates to be used in the classification process here.' }"
          )
        .row-2
          CardText.row-item.text-right.px-5(value="Area of Interest")
          .row-item
            CardButton(
              id="aoi-button"
              full-w
              :value="aoi !== null ? 'Modify' : 'Choose'"
              :completed="aoi !== null"
              :error="errors.aoi"
              @click="aoi_modal_handler.open()"
              v-tippy="{ content: 'This button is used to select the area of interest for your classification.' }"
            )
            .uploaded-file.mt-1.flex.justify-center(v-if="aoi_file")
              small.text-ellipsis.whitespace-nowrap.overflow-hidden(v-text="aoi_file.name")
              button.delete-file-button(type="button" :class="'hover:text-ml-red'" @click="deleteAoiFile")
                mdicon(name="window-close")
        .row-2
          CardText.row-item.text-right.px-5(value="Training Data")
          .row-item
            CardButton(
              id="td-button"
              full-w
              :value="td !== null ? 'Modify' : 'Choose'"
              :completed="td !== null"
              :error="errors.td"
              @click="td_modal_handler.open()"
              v-tippy="{ content: 'This button is used to select the training data for your classification.' }"
            )
            .uploaded-file.mt-1.flex.justify-center(v-if="td_file")
              small.text-ellipsis.whitespace-nowrap.overflow-hidden(v-text="td_file.name")
              button.delete-file-button(type="button" :class="'hover:text-ml-red'" @click="deleteTdFile")
                mdicon(name="window-close")
        .row-2
          CardText.row-item.text-right.px-5(value="Hyperparameter")
          CardButton.row-item(
            id="hp-button"
            full-w
            :value="hyperparams.length > 0 ? 'Modify' : 'Tune'"
            :completed="hyperparams.length > 0"
            :error="errors.hyperparams"
            @click="hyperparameter_modal_handler.open()"
            v-tippy="{ content: 'Tune hyperparameters for your clasification.' }"
          )
        .row-2
          CardText.row-item.text-right.px-5(value="Resolution")
          DropdownSelect.row-item(
            id="rs-button"
            :values="[{ label: '10x10', value: 10 }, { label: '30x30', value: 30 }, { label: '60x60', value: 60 }]"
            :selected="1"
            @change="value => resolution = value"
            v-tippy="{ content: 'This button is used to select the resolution for your classification.' }"
          )
        .row-2.row-2-b
          .px-5.row-item
            button.demo-button.transition-2(id="demo-button" v-text="'Demo'" @click="start_demo")
          button.row-item.calculate-button.font-semibold.transition-2(id="calc-button" v-text="'Calculate'" @click="start_request")
  template(v-else)
    .loading.flex.flex-col
      .lds-roller
        div
        div
        div
        div
        div
        div
        div
        div
      .text-ml-text.mt-5 Loading ...
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, type Ref, onMounted, type PropType } from "vue";
import { useModal } from "@/composables/use-modal";
import { ModalIds } from "@/enums";
import CardDark from "@/components/base/CardDark.vue";
import CardButton from "@/components/base/CardButton.vue";
import CardText from "@/components/base/CardText.vue";
import DatePicker from "@/components/form/DatePicker.vue";
import FileUpload from "@/components/form/FileUpload.vue";
import DropdownSelect from "@/components/form/DropdownSelect.vue";
import AreaOfInterestModal from "@/components/modals/home/area-of-interest.modal.vue";
import HyperparameterModal from "@/components/modals/home/hyperparameter.modal.vue";
import TrainingDataModal from "@/components/modals/home/training-data.modal.vue";
import type { SubmitPayload } from "@/types/AppTypes";
import { fileToFeatureCollection, payloadToPolygonFeature, payloadToFeatureCollection } from "../helper/geojson";
import type { Polygon, FeatureCollection, Feature } from "@/types/geojson";
import type { Req } from "@/types/api";
import router from "@/router";

import { useApi } from "@/composables/use-api";
import { useDemo } from "@/composables/use-demo";
import { demo_aoi, demo_td } from "../helper/demodata";
import { useBlobResult } from "@/composables/use-blob-result";

export default defineComponent({
  components: {
    CardDark,
    CardButton,
    CardText,
    DatePicker,
    FileUpload,
    AreaOfInterestModal,
    DropdownSelect,
    HyperparameterModal,
    TrainingDataModal,
  },
  props: {
    demo: {
      type: Object as PropType<ReturnType<typeof useDemo>>,
      required: true,
    },
  },
  setup(props) {
    const { classify_request } = useApi();
    const { setResult, setClassMap } = useBlobResult();

    const doi: Ref<Date[] | null> = ref(null);
    const tot: Ref<Date[] | null> = ref(null);
    const aoi: Ref<Feature<Polygon> | null> = ref(null);
    const td: Ref<FeatureCollection | null> = ref(null);
    const hyperparams: Ref<{ name: string; value: number }[]> = ref([]);
    const resolution: Ref<10 | 30 | 60> = ref(30);

    const errors = ref({
      doi: false,
      aoi: false,
      td: false,
      hyperparams: false,
    });

    const aoi_file = ref<File | null>();
    const td_file = ref<File | null>();

    const loading_result: Ref<boolean> = ref(false);

    const aoi_submit = async (payload: SubmitPayload) => {
      errors.value.aoi = false;
      deleteAoiFile();
      aoi.value = await payloadToPolygonFeature(payload);
      (document.getElementById("aoi-upload") as HTMLInputElement).value = "";
      if (payload instanceof File) aoi_file.value = payload;
      if (!aoi.value)  errors.value.aoi = true;
    };

    const td_submit = async (payload: any) => {
      if (payload.tot) tot.value = payload.tot;
      errors.value.td = false;
      deleteTdFile();
      if (payload.file instanceof File) {
        td.value = await payloadToFeatureCollection(payload.file);
        td_file.value = payload.file;
      } else {
        td.value = await payloadToFeatureCollection(payload.collection);
      }
      if (!td.value)  errors.value.td = true;
    };

    const hyperparameter_submit = (payload: SubmitPayload) => {
      errors.value.hyperparams = false;
      hyperparams.value = payload as { name: string; value: number }[];
      if (!hyperparams.value) errors.value.hyperparams = true;
    };

    const aoi_modal_handler = useModal(ModalIds.HOME__AREA_OF_INTEREST_MODAL, aoi_submit);
    const hyperparameter_modal_handler = useModal(ModalIds.HOME__HYPERPARAMETER_MODAL, hyperparameter_submit);
    const td_modal_handler = useModal(ModalIds.HOME__TRAINING_DATA_MODAL, td_submit);

    const deleteAoiFile = () => {
      aoi.value = null;
      aoi_file.value = null;
      errors.value.aoi = false;
    };

    const deleteTdFile = () => {
      td.value = null;
      td_file.value = null;
      errors.value.td = false;
    };

    const selectDoi = (dates: Date[]) => {
      doi.value = dates;
    };

    const uploadedTD = async (file: File) => {
      errors.value.td = false;
      td.value = await fileToFeatureCollection(file);
      (document.getElementById("td-upload") as HTMLInputElement).value = "";
      if (!td.value) errors.value.td = true;
    };

    const reset_td = () =>{
      td.value = null;
      errors.value.td = false;
    };

    const start_request = async () => {
      if (aoi.value && doi.value?.length === 2 && tot.value?.length === 2 && td.value) {
        loading_result.value = true;
        const payload: Req.Classify.Payload = {
          model: "RandomForest",
          TOI: {
            start_date: doi.value[0]!.toISOString().split("T")[0]!,
            end_date: doi.value[1]!.toISOString().split("T")[0]!,
          },
          AOI: {
            geometry: aoi.value.geometry,
          },
          Training_Data: td.value,
          tot: {
            start_date: tot.value[0]!.toISOString().split("T")[0]!,
            end_date: tot.value[1]!.toISOString().split("T")[0]!,
          },
          Hyperparameter: hyperparams.value,
          Resolution: resolution.value,
        };

        console.log(payload);
        console.log(JSON.stringify(payload));
        const response = await classify_request(payload);
        const base64_string = response.classification;
        setClassMap(response.class_map);
        const blob = b64toBlob(base64_string, "image/tiff");

        const blobUrl = URL.createObjectURL(blob);

        document.location = blobUrl;
        setResult(blob);

        router.push("/result");
      }else{
        if (!aoi.value) errors.value.aoi = true;
        if (!doi.value || doi.value.length !== 2) errors.value.doi = true;
        if (!tot.value || tot.value.length !== 2) errors.value.td = true;
        if (!td.value) errors.value.td = true;
      }
    };

    const b64toBlob = (b64Data: string, contentType='', sliceSize=512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, {type: contentType});
      return blob;
    };

    const instance = ref();
    onMounted(() => {
      instance.value = getCurrentInstance();
    });

    props.demo.onSelectDoi(() => {
      selectDoi([new Date("2023-06-15"), new Date("2024-06-25")]);
    });

    props.demo.onSelectAoi(() => {
      aoi_modal_handler.close();
      aoi_submit(demo_aoi);
    });

    props.demo.onSelectTot(() => {
      tot.value = [new Date("2023-06-15"), new Date("2024-06-25")];
    });

    props.demo.onSelectTd(() => {
      td_modal_handler.close();
      td_submit(demo_td);
    });

    props.demo.onSelectHyperparams(() => {
      hyperparameter_submit([{ name: "ntree", value: 100 }, { name: "mtry", value: 10 }]);
    });

    props.demo.onSelectResolution(() => {
      resolution.value = 30;
    });

    props.demo.onReset(() => {
      aoi_modal_handler.close();
      td_modal_handler.close();
      deleteAoiFile();
      deleteTdFile();
      reset_td();
      hyperparams.value = [];
      resolution.value = 30;
      doi.value = null;
    });

    props.demo.onFinish(() => {
      start_request();
      stop_demo();
    });

    const start_demo = () => {
      const $tours = instance!.value.appContext.config.globalProperties.$tours;
      if ($tours) {
          if ($tours['demoProcess']) {
              $tours['demoProcess'].start();
          }
      }
    };

    const stop_demo = () => {
      const $tours = instance!.value.appContext.config.globalProperties.$tours;
      if ($tours) {
          if ($tours['demoProcess']) {
              $tours['demoProcess'].stop();
          }
      }
    };

    return {
      aoi_modal_handler,
      ModalIds,
      aoi_file,
      td_file,
      deleteAoiFile,
      selectDoi,
      uploadedTD,
      reset_td,
      doi,
      aoi,
      td,
      hyperparams,
      errors,
      resolution,
      start_request,
      loading_result,
      hyperparameter_modal_handler,
      td_modal_handler,
      start_demo,
      deleteTdFile,
    };
  },
});
</script>

<style scoped>
@import '@/assets/spinner.css';

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
