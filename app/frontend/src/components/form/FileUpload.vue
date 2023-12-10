<template lang="pug">
.file-upload
  label.transition-2(
    :for="id"
    v-text="value"
    :class="inputClass"
  )
  input.hidden(
    :id="id"
    type="file"
    accept=".json, .geojson"
    capture
    @change="onFileChanged($event)"
  )
  .uploaded-file.mt-1.flex.justify-center(v-if="file")
    small(v-text="file.name")
    button.delete-file-button(type="button" :class="'hover:text-ml-red'" @click="deleteFile")
      mdicon(name="window-close")
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from "vue";

export default defineComponent({
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
  },
  emits: ["click"],
  setup(props) {
    const file = ref<File | null>();

    const onFileChanged = ($event: Event) => {
      const target = $event.target as HTMLInputElement;
      if (target && target.files) {
        if(props.types.includes(target.files[0]?.name.split(".").slice(-1)[0] ?? ""))
          file.value = target.files[0];
        else
          console.log("Wrong Type: ", target.files[0]?.name);
      }
    };

    const deleteFile = () => {
      file.value = null;
    };

    return { onFileChanged, deleteFile, file };
  },
});
</script>

<style scoped>
.delete-file-button {
  vertical-align: middle;
}
</style>