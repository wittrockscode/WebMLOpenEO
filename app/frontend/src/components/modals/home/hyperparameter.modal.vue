<template lang="pug">
Modal(:handler="handler" title="Hyperparameters" :id="id")
  .input-group.flex.justify-between.w-full.mt-4.flex-col
    TextInput(id="ntrees" placeholder="ntrees" type="number" v-model="ntrees")
    TextInput(id="mtry" placeholder="mtry" type="number" v-model="mtry")
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "@/components/base/Modal.vue";
import type { PropType, Ref } from "vue";
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
    const ntrees: Ref<null | number> = ref(null);
    const mtry: Ref<null | number> = ref(null);

    props.handler.onSubmit(() => {
      props.handler.setPayload([{ name: "ntrees", value: ntrees.value ?? 0 }, { name: "mtry", value: mtry.value ?? 0 }]);
    });

    return { ntrees, mtry };
  },
});
</script>
