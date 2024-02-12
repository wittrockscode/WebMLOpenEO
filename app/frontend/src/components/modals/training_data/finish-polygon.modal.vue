<template lang="pug">
Modal(:handler="handler" title="Select a class" :id="id")
  #select-class
    DropdownSelect(id="select-class-input" @change="value => setVal(value)" :values="trainingDataClasses.map((name) => ({ label: name, value: name }))")
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "@/components/base/Modal.vue";
import DropdownSelect from "@/components/form/DropdownSelect.vue";
import type { PropType } from "vue";
import type { Feature } from "@/types/geojson";
import type { useModal } from "@/composables/use-modal";
import type { useTrainingData } from "@/composables/use-training-data";

export default defineComponent({
  components: {
    Modal,
    DropdownSelect,
  },
  props: {
    handler: {
      type: Object as PropType<ReturnType<typeof useModal>>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    trainingDataClasses: {
      type: Array as PropType<string[]>,
      required: true,
    },
    trainingData: {
      type: Object as PropType<ReturnType<typeof useTrainingData>>,
      required: true,
    },
  },
  setup(props) {
    const val = ref("");
    const feat = ref<Feature |null>(null);

    const setVal = (value: any) => {
      val.value = value;
      props.trainingData.setCurrentClass(value);
    };

    props.handler.onOpen((value: any) => {
      feat.value = value;
      val.value = props.trainingDataClasses[0] ?? "";
    });

    props.handler.onSubmit(() => {
      if (feat.value === null) return;
      if (feat.value.properties === undefined || feat.value.properties === null) {
        feat.value.properties = {};
      }
      feat.value.properties.class = props.trainingData.currentClass.value;
      props.handler.setPayload(feat.value);
      feat.value = null;
      val.value = "";
    });
    return { setVal };
  },
});
</script>
