<template lang="pug">
Teleport(to="body")
  div.modal-invisible(:id="id")
    .modal-backdrop(v-if="backdrop" :style="{ zIndex: zIndexCalc - 1 }")
    .modal.block(:style="{ zIndex: zIndexCalc }")
      .modal-outer-click-area(@mousedown="outerClick" @click="outerClick")
        .modal-content(@mousedown.stop="" @click.stop="").rounded.bg-ml-text.text-ml-black.px-5.py-3
          .modal-header(v-if="!hideHeader")
            slot(name="header")
              .header-content.flex.justify-between.text-4xl
                h3.modal-title.font-semibold(v-text="title")
                button.btn-close.transition-2(
                  type="button"
                  :aria-label="'Close'"
                  @click="cancel"
                )
                  mdicon(name="window-close")
              hr.mt-2.bg-ml-dark.border-ml-dark
          .modal-body.text-3xl.my-4
            slot(
              :cancel="cancel"
              :submit="submit"
            )
          .modal-footer.font-semibold(v-if="!hideFooter")
            slot(
              name="footer"
              :cancel="cancel"
              :submit="submit"
            )
              hr.mb-4.bg-ml-dark.border-ml-dark
              .footer-content.flex.justify-between.text-2xl
                button.btn-secondary(
                  type="button"
                  @click="cancel"
                  v-text="cancelText"
                  :id="`${id}-cancel-button`"
                )
                button.btn-primary(
                  type="button"
                  @click="submit"
                  v-text="submitText"
                  :id="`${id}-submit-button`"
                )
</template>

<script lang="ts">
import type { useModal } from "@/composables/use-modal";
import { defineComponent, ref } from "vue";
import type { PropType } from "vue";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    backdrop: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      deafult: 100,
    },
    title: {
      type: String,
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: String,
      default: "Cancel",
    },
    submitText: {
      type: String,
      default: "Submit",
    },
    cancelFn: {
      type: Function,
      default: null,
    },
    submitFn: {
      type: Function,
      default: null,
    },
    outerClickFn: {
      type: Function,
      default: null,
    },
    handler: {
      type: Object as PropType<ReturnType<typeof useModal>>,
      required: true,
    },
  },
  emits: ["close", "submit", "outerClick"],
  setup(props, { emit }) {
    const cancel = props.handler ? props.handler.cancelFn : (props.cancelFn ?? emit("close"));
    const submit = props.handler ? props.handler.beforeSubmit : (props.submitFn ?? emit("submit"));
    const outerClick = props.handler ? props.handler.outerClickFn : (props.outerClickFn ?? emit("outerClick"));

    const zIndexCalc =  ref(props.handler ? props.handler.zIndex.value : props.zIndex);

    return { cancel, submit, outerClick, zIndexCalc };
  },
});
</script>
