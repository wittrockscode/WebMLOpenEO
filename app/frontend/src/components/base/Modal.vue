<template lang="pug">
Teleport(to="body")
  div.modal-invisible(:id="id")
    .modal-backdrop(v-if="backdrop")
    .modal.block
      #modal-outer-click-area(@mousedown="outerClick" @click="outerClick")
        .modal-content(@mousedown.stop="" @click.stop="").rounded.bg-ml-text.text-ml-black.px-5.py-3
          .modal-header(v-if="!hideHeader")
            slot(name="header")
              .header-content.flex.justify-between.text-4xl
                h3.modal-title.font-semibold(v-text="title")
                button.btn-close(
                  type="button"
                  :aria-label="'Close'"
                  @click="cancel"
                )
                  mdicon(name="window-close")
              hr.my-2.text-ml-dark
          .modal-body.text-3xl
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
              hr.my-4.text-ml-dark
              .footer-content.flex.justify-between.text-2xl
                button.rounded.bg-ml-dark.text-ml-text.p-1.transition-2.hover-shadow(
                  type="button"
                  @click="cancel"
                  v-text="cancelText"
                )
                button.rounded.bg-ml-dark.text-ml-text.p-1.transition-2.hover-shadow(
                  type="button"
                  @click="submit"
                  v-text="submitText"
                )
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
      type: Object as PropType<ModalHandler>,
      required: true,
    },
  },
  emits: ["close", "submit", "outerClick"],
  setup(props, { emit }) {
    const cancel = props.handler ? props.handler.cancelFn : (props.cancelFn ?? emit("close"));
    const submit = props.handler ? props.handler.submitFn : (props.submitFn ?? emit("submit"));
    const outerClick = props.handler ? props.handler.outerClickFn : (props.outerClickFn ?? emit("outerClick"));

    return { cancel, submit, outerClick };
  },
});
</script>
