<template lang="pug">
Modal(:handler="handler" title="Hyperparameters" :id="id")
  .input-group.flex.justify-between.w-full.mt-4.flex-col
    label(for="ntree") ntree:
    TextInput(id="ntree" placeholder="ntree" type="number" v-model="ntree")
    label.mt-2(for="mtry") mtry:
    TextInput(id="mtry" placeholder="mtry" type="number" v-model="mtry")
    br
    p.text-lg Changing these values might affect the result in a negative way.
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "@/components/base/Modal.vue";
import type { PropType, Ref } from "vue";
import TextInput from "@/components/form/TextInput.vue";
import type { useModal } from "@/composables/use-modal";

export default defineComponent({
  components: {
    Modal,
    TextInput,
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
  },
  setup(props) {
    const ntree: Ref<null | number> = ref(null);
    const mtry: Ref<null | number> = ref(null);

    const resetData = () => {
      ntree.value = null;
      mtry.value = null;
    };

    props.handler.onBeforeSubmit(() => {
      props.handler.setPayload([{ name: "ntree", value: ntree.value ?? 0 }, { name: "mtry", value: mtry.value ?? 0 }]);
      return true;
    });

    props.handler.onReset(() => {
      resetData();
    });

    return { ntree, mtry };
  },
});
</script>
