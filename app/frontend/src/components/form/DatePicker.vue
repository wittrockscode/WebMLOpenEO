<template lang="pug">
VueDatePicker.form-item(
  :id="id"
  v-model="date"
  :enable-time-picker="false"
  :placeholder="placeholder"
  :format="range ? formatRange : format"
  dark
  @update:model-value="handleDateSelect"
  :class="error ? 'form-error' : completed ? 'form-completed' : ''"
  :range="range"
  :max-date="new Date()"
)
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    placeholder: {
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
    range: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Date, Array],
      default: null,
    },
    error: {
      type: Boolean,
      default: false,
    }
  },
  emits: ["selected"],
  setup(props, { emit }) {
    const date = ref(props.value);

    const formatRange = (dates: Date[]) => {
      if (dates.length !== 2) return "";
      const day1 = dates[0]!.getDate();
      const month1 = dates[0]!.getMonth() + 1;
      const year1 = dates[0]!.getFullYear();

      const day2 = dates[1]!.getDate();
      const month2 = dates[1]!.getMonth() + 1;
      const year2 = dates[1]!.getFullYear();

      return `${day1}/${month1}/${year1} - ${day2}/${month2}/${year2}`;
    };

    const format = (date: Date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    };

    const handleDateSelect = (modelData: Date[] | Date) => {
      emit("selected", modelData);
    };

    return { date, format, formatRange, handleDateSelect };
  },
});
</script>
