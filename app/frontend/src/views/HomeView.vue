<template lang="pug">
AreaOfInterestModal(:handler="aoi_modal_handler" :id="ModalIds.HOME__AREA_OF_INTEREST_MODAL" :isPolygonSelected="aoi !== null && aoi_file === null")
HyperparameterModal(:handler="hyperparameter_modal_handler" :id="ModalIds.HOME__HYPERPARAMETER_MODAL")
TrainingDataModal(:handler="td_modal_handler" :id="ModalIds.HOME__TRAINING_DATA_MODAL")
.wrapper
  #home.w-full(v-if="!loading_result")
    CardDark
      .card-content.text-3xl.py-3.items-center.flex.flex-col
        .row-2.items-center
          CardText.row-item.text-right.pr-5(value="Algorithm")
          CardText#model-name.row-item.text-ml-blue.text-center(value="RandomForest")
        .row-2.items-center
          CardText.row-item.text-right.pr-5(value="Area of Interest")
          .row-item
            CardButton(
              id="aoi-button"
              full-w
              :value="aoi !== null ? 'Modify' : 'Choose'"
              :completed="aoi !== null"
              :error="errors.aoi"
              @click="aoi_modal_handler.open()"
              v-tippy="{ content: 'This button is used to select the area of interest for your classification.' }"
              :responsive="false"
            )
            .uploaded-file.mt-1.flex.justify-center(v-if="aoi_file")
              small.text-ellipsis.whitespace-nowrap.overflow-hidden(v-text="aoi_file")
              button.delete-file-button(type="button" :class="'hover:text-ml-red'" @click="deleteAoiFile")
                mdicon(name="window-close")
        .row-2.items-center
          CardText.row-item.text-right.pr-5(value="Training Data")
          .row-item
            CardButton(
              id="td-button"
              full-w
              :value="td !== null ? 'Modify' : 'Choose'"
              :completed="td !== null && td.features.length > 0"
              :error="errors.td"
              @click="td_modal_handler.open()"
              v-tippy="{ content: 'This button is used to select the training data for your classification.' }"
              :responsive="false"
            )
            .uploaded-file.mt-1.flex.justify-center(v-if="td_file")
              button.delete-file-button(type="button" :class="'hover:text-ml-red'" @click="deleteTdFile")
                mdicon(name="window-close")
        .row-2.items-center
          CardText.row-item.text-right.pr-5(value="Hyperparameter")
          CardButton.row-item(
            id="hp-button"
            full-w
            :value="hyperparams.length > 0 ? 'Modify' : 'Choose'"
            :completed="hyperparams.length > 0"
            :error="errors.hyperparams"
            @click="hyperparameter_modal_handler.open()"
            v-tippy="{ content: 'Tune hyperparameters for your clasification.' }"
            :responsive="false"
          )
        .row-2.items-center
          CardText.row-item.text-right.pr-5(value="Resolution")
          DropdownSelect.row-item(
            id="rs-button"
            :values="[{ label: '10x10', value: 10 }, { label: '30x30', value: 30 }, { label: '60x60', value: 60 }]"
            :completed="resolution !== null"
            :selected="1"
            @change="(value) => { resolution = value; errors.resolution = false}"
            v-tippy="{ content: 'This button is used to select the resolution for your classification.' }"
            withChoose
            :error="errors.resolution"
          )
        label.text-xl.ml-1.text-ml-red.font-semibold.mb-2( v-if="errors.request") {{`Error: ${errors.request_text}`}}
        .row-2.items-center.row-2-b
          .pr-5.row-item
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
      .text-ml-text.mt-5(v-text="facts && facts.length > 0 ? facts[current_fact].fact : 'Loading ...'")
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
import type { Polygon, FeatureCollection, Feature } from "@/types/geojson";
import type { Req } from "@/types/api";
import type { AoiModalPayload, TdModalPayload, HyperParameterModalPayload, Nullable } from "@/types/AppTypes";
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
    const { classify_request, get_demo_data_request, demo_classify_request, facts_api_request } = useApi();
    const { setResult, setClassMap, setModelId, setIsDemo } = useBlobResult();

    const toi: Ref<Date[] | null> = ref(null);
    const tot: Ref<Date[] | null> = ref(null);
    const aoi: Ref<Feature<Polygon> | null> = ref(null);
    const td: Ref<FeatureCollection | null> = ref(null);
    const hyperparams: Ref<{ name: string; value: number }[]> = ref([]);
    const resolution: Ref<10 | 30 | 60 | null> = ref(null);

    const demo_data_payload = ref(null);

    const errors = ref({
      toi: false,
      aoi: false,
      td: false,
      hyperparams: false,
      resolution: false,
      request: false,
      request_text: "",
    });

    const facts = ref([]);
    const current_fact = ref(0);

    const aoi_file = ref<string | null>();
    const td_file = ref<string | null>();

    const loading_result: Ref<boolean> = ref(false);

    const aoi_submit = async (payload: Nullable<AoiModalPayload>) => {
      if (payload === null) {
        errors.value.aoi = true;
        return;
      };
      errors.value.aoi = false;
      deleteAoiFile();
      if (payload.aoi === null || payload.toi === null) {
        aoi.value = null;
        errors.value.aoi = true;
        return;
      }
      aoi.value = payload.aoi;
      toi.value = payload.toi;
      if (payload.withFile)
        aoi_file.value = payload.fileName;
    };

    const td_submit = async (payload: Nullable<TdModalPayload>) => {
      if (payload === null) {
        errors.value.td = true;
        return;
      };
      errors.value.td = false;
      deleteTdFile();
      if (payload.td === null || payload.tot === null || payload.td.features.length === 0) {
        td.value = null;
        tot.value = null;
        errors.value.td = true;
        return;
      }
      tot.value = payload.tot;
      td.value = payload.td;
      if (payload.withFile)
        td_file.value = payload.fileName;
    };

    const hyperparameter_submit = (payload: Nullable<HyperParameterModalPayload>) => {
      if (payload === null) {
        errors.value.hyperparams = true;
        return;
      };
      errors.value.hyperparams = false;
      hyperparams.value = payload;
      if (!hyperparams.value) errors.value.hyperparams = true;
    };

    const aoi_modal_handler = useModal<AoiModalPayload>(ModalIds.HOME__AREA_OF_INTEREST_MODAL, aoi_submit);
    const hyperparameter_modal_handler = useModal<HyperParameterModalPayload>(ModalIds.HOME__HYPERPARAMETER_MODAL, hyperparameter_submit);
    const td_modal_handler = useModal<TdModalPayload>(ModalIds.HOME__TRAINING_DATA_MODAL, td_submit);

    const deleteAoiFile = () => {
      aoi.value = null;
      aoi_file.value = null;
      (document.getElementById("aoi-upload") as HTMLInputElement).value = "";
      errors.value.aoi = false;
    };

    const deleteTdFile = () => {
      td.value = null;
      td_file.value = null;
      errors.value.td = false;
    };

    const reset_td = () =>{
      td.value = null;
      tot.value = null;
      errors.value.td = false;
    };

    const start_demo_request = async () => {
      errors.value.request = false;
      errors.value.request_text = "";
      loading_result.value = true;
      const facts_response = await facts_api_request();
      facts.value = facts_response;
      const intervalID = setInterval(() => {
        current_fact.value = current_fact.value + 1;
        if (current_fact.value >= facts.value.length) current_fact.value = 0;
      }, 5000);
      const start_time = Date.now();
      const response = await demo_classify_request(demo_data_payload.value!);
      if ("error" in response) {
        errors.value.request =
          ((response.error as unknown as any).response.data.errors
            || (response.error as unknown as any).response.data.message)
            || (response.error as unknown as any).message;
        loading_result.value = false;
        clearInterval(intervalID);
        return;
      }

      const base64_string = response.classification;
      setIsDemo(true);
      setModelId(response.model_id);
      setClassMap(response.class_map);
      const blob = await b64toBlob(base64_string, "image/tiff");

      setResult(blob);

      const end_time = Date.now();

      console.log(`Demo took ${end_time - start_time}ms`);
      clearInterval(intervalID);
      router.push("/result");
    };

    const start_request = async () => {
      if (aoi.value && toi.value?.length === 2 && tot.value?.length === 2 && td.value && resolution.value) {
        loading_result.value = true;
        errors.value.request = false;
        errors.value.request_text = "";
        const facts_response = await facts_api_request();
        facts.value = facts_response;
        const intervalID = setInterval(() => {
          current_fact.value = current_fact.value + 1;
          if (current_fact.value >= facts.value.length) current_fact.value = 0;
        }, 7500);

        td.value.features = td.value.features.map((feature) => {
          delete feature.properties!["id"];
          return feature;
        });

        const payload: Req.Classify.Payload = {
          model: "RandomForest",
          TOI: {
            start_date: toi.value[0]!.toISOString().split("T")[0]!,
            end_date: toi.value[1]!.toISOString().split("T")[0]!,
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
          Resolution: Number(resolution.value) as 10 | 30 | 60,
        };

        const response = await classify_request(payload);
        if ("error" in response) {
          errors.value.request = true;
          errors.value.request_text =
          Array.isArray((response.error as unknown as any).response.data.errors)
          ? (response.error as unknown as any).response.data.errors[0].message
          : (((response.error as unknown as any).response.data.errors
          || (response.error as unknown as any).response.data.message)
          || (response.error as unknown as any).message);
          loading_result.value = false;
          clearInterval(intervalID);
          return;
        }

        const base64_string = response.classification;
        setIsDemo(false);
        setClassMap(response.class_map);
        setModelId(response.model_id);
        const blob = await b64toBlob(base64_string, "image/tiff");

        clearInterval(intervalID);
        setResult(blob);
        router.push("/result");
      }else{
        if (!aoi.value) errors.value.aoi = true;
        if (!toi.value || toi.value.length !== 2) errors.value.toi = true;
        if (!tot.value || tot.value.length !== 2) errors.value.td = true;
        if (!td.value) errors.value.td = true;
        if (!resolution.value) errors.value.resolution = true;
      }
    };

    const b64toBlob = (base64: string, type = 'application/octet-stream'): Promise<Blob> => fetch(`data:${type};base64,${base64}`).then(res => res.blob());

    const instance = ref();
    onMounted(() => {
      instance.value = getCurrentInstance();
    });

    const resetData = () => {
      aoi_modal_handler.reset();
      td_modal_handler.reset();
      hyperparameter_modal_handler.reset();
      resolution.value = null;
      deleteAoiFile();
      deleteTdFile();
      reset_td();
      hyperparams.value = [];
      errors.value = {
        toi: false,
        aoi: false,
        td: false,
        hyperparams: false,
        resolution: false,
        request: false,
        request_text: "",
      };
    };

    props.demo.onStart(async () => {
      const response = await get_demo_data_request();
      demo_data_payload.value = response;
      resetData();
    });

    props.demo.onClosedAoiModal(() => {
      aoi_modal_handler.close();
    });

    props.demo.onClosedTdModal(() => {
      td_modal_handler.close();
    });

    props.demo.onSelectAoi(() => {
      aoi_modal_handler.close();
      aoi_submit(demo_aoi);
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
      resetData();
    });

    props.demo.onFinish(() => {
      start_demo_request();
      stop_demo();
    });

    props.demo.onClosedDemoModal(() => {
      stop_demo();
    });

    props.demo.onCreateTd(() => {
      td_modal_handler.setState(1);
    });

    props.demo.onResetTdState(() => {
      td_modal_handler.setState(0);
    });

    const start_demo = () => {
      document.getElementsByClassName("v-tour")[0]?.setAttribute('style', 'display:block');
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
      document.getElementsByClassName("v-tour")[0]?.setAttribute('style', 'display:none');
    };

    return {
      aoi_modal_handler,
      ModalIds,
      aoi_file,
      td_file,
      deleteAoiFile,
      reset_td,
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
      facts,
      current_fact,
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
