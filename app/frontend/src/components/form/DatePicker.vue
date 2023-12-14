<template lang="pug">
VueDatePicker.form-item(
  :id="id"
  v-model="date"
  :enable-time-picker="false"
  :placeholder="value"
  :format="format"
  dark
  @update:model-value="handleDateSelect"
  :class="completed ? 'form-completed' : ''"
)
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["selected"],
  setup(props, { emit }) {
    const date = ref(null);

    const format = (date: Date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    };

    const handleDateSelect = (modelDate: Date) => {
      emit("selected", modelDate);
    };

    return { date, format, handleDateSelect };
  },
});
</script>
