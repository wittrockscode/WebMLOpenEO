<template lang="pug">
Modal(:handler="handler" title="Hyperparameters" :id="id")
  .input-group.flex.justify-between.w-full.mt-4.flex-col
    TextInput(id="ntrees" placeholder="ntrees" type="number" @input="value => setNtrees(value)")
    TextInput(id="mtry" placeholder="mtry" type="number" @input="value => setMtry(value)")
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "@/components/base/Modal.vue";
import type { PropType } from "vue";
import type { ModalHandler } from "@/types/AppTypes";
import TextInput from "@/components/form/TextInput.vue";

export default defineComponent({
  components: {
    Modal,
    TextInput,
  },
  props: {
    handler: {
      type: Object as PropType<ModalHandler>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const ntrees = ref(0);
    const mtry = ref(0);

    const setNtrees = (value: number) => {
      ntrees.value = value;
      props.handler.setPayload([{ name: "ntrees", value: value }, { name: "mtry", value: mtry.value }]);
    };

    const setMtry = (value: number) => {
      mtry.value = value;
      props.handler.setPayload([{ name: "ntrees", value: ntrees.value }, { name: "mtry", value: value }]);
    };

    return { setNtrees, setMtry };
  },
});
</script>
@/types/AppTypes