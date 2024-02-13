<template lang="pug">
Modal(:handler="handler" title="Edit Polygon" :id="id")
  #edit-polygon(v-if="show")
    .control-group.flex.flex-row.items-center.w-full.justify-between.mb-5
      p.flex-item Remove the Polygon?
      CardButton.flex-item(
        :id="id"
        :value="'Remove'"
        full-w
        @click="removePolygon"
      )
    .control-group.flex.flex-row.items-center.w-full.justify-between.mb-5
      p.flex-item Change the Class
      DropdownSelect.flex-item(id="edit-polygon-dropdown" @change="value => setVal(value)" :values="trainingDataClasses.map((name) => ({ label: name, value: name }))" :selected="currentClassIndex")
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "@/components/base/Modal.vue";
import DropdownSelect from "@/components/form/DropdownSelect.vue";
import type { PropType } from "vue";
import { Feature } from "ol";
import type { useModal } from "@/composables/use-modal";
import type { useTrainingData } from "@/composables/use-training-data";
import CardButton from "@/components/base/CardButton.vue";

export default defineComponent({
  components: {
    Modal,
    DropdownSelect,
    CardButton
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
    const show = ref(false);
    const currentClassIndex = ref<number | null>(null);
    const polygon = ref<Feature | null>(null);
    const value = ref<string | null>(null);

    const setVal = (val: string) => {
      value.value = val;
      props.trainingData.setPolygonClass(polygon.value?.getId()! as string, val);
    };

    const removePolygon = () => {
      props.trainingData.removePolygon(polygon.value?.getId()! as string);
      props.handler.setPayload(polygon.value);
      props.handler.submitFn();
    };

    const reset = () => {
      props.handler.setPayload(null);
      show.value = false;
      currentClassIndex.value = null;
      value.value = null;
      polygon.value = null;
    };

    props.handler.onClose(() => {
      reset();
    });

    props.handler.onOpen((val: Feature) => {
      reset();
      polygon.value = val;
      const currentClass = props.trainingData.polygons.value.find((polygon) => polygon.properties?.id === val.getId())?.properties?.class ?? null;
      currentClassIndex.value = props.trainingDataClasses.indexOf(currentClass);
      value.value = currentClass;
      show.value = true;
    });

    return { show, currentClassIndex, setVal, removePolygon };
  },
});
</script>

<style scoped>
.flex-item {
  flex: 1 1 0px;
}
</style>
