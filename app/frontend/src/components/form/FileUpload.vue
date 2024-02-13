<template lang="pug">
.file-upload(:id="`${id}_div`" v-if="isClickButton")
  CardButton(
    id="td-upload-button"
    :value="value"
    @click="$emit('click')"
    full-w
    :disabled="disabled"
  )
.file-upload(:id="`${id}_div`" v-else)
  label.transition-2.form-item(
    :for="id"
    v-text="value"
    :class="classes_to_add"
  )
  input.hidden(
    :id="id"
    type="file"
    accept=".json, .geojson, .gpkg"
    capture
    :disabled="disabled"
    @change="onFileChanged($event)"
  )
  .uploaded-file.mt-1.flex.justify-center(v-if="showUploadedFile && file")
    small.text-ellipsis.whitespace-nowrap.overflow-hidden(v-text="file.name")
    button.delete-file-button(type="button" :class="'hover:text-ml-red'" @click="deleteFile")
      mdicon(name="window-close")
</template>

<script lang="ts">
import type { useModal } from "@/composables/use-modal";
import { defineComponent, ref, type PropType, computed } from "vue";
import CardButton from "@/components/base/CardButton.vue";

export default defineComponent({
  components: {
    CardButton,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    types: {
      type: Array as PropType<string[]>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    inputClass: {
      type: String,
      default: "file-upload-label",
    },
    showUploadedFile: {
      type: Boolean,
      default: false,
    },
    asSubmitFor: {
      type: Object as PropType<ReturnType<typeof useModal>>,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isClickButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click", "uploaded", "deleted"],
  setup(props, { emit }) {
    const file = ref<File | null>();

    const onFileChanged = ($event: Event) => {
      const target = $event.target as HTMLInputElement;
      if (target && target.files) {
        if (props.types.includes(target.files[0]?.name.split(".").slice(-1)[0] ?? "")) {
          file.value = target.files[0];
          if (props.asSubmitFor && target.files[0]) fileUploaded(target.files[0]);
          else emit("uploaded", target.files[0]);
        }
        else
          console.log("Wrong Type: ", target.files[0]?.name);
      }
    };

    const deleteFile = () => {
      file.value = null;
      emit("deleted");
    };

    const fileUploaded = (file: File) => {
      props.asSubmitFor.setPayload(file);
      props.asSubmitFor.submitFn();
    };

    const classes_to_add = computed(() => `${props.error ? 'form-error' : props.completed ? 'form-completed' : ''} ${props.disabled ? props.inputClass + '-disabled' : props.inputClass}`);

    return { onFileChanged, deleteFile, file, classes_to_add };
  },
});
</script>

<style scoped>
.delete-file-button {
  vertical-align: middle;
}
</style>
