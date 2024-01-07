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
  range
  :max-date="new Date()"
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
    const date = ref([new Date(new Date().setDate(new Date().getDate() - 1)), new Date()]);

    const format = (dates: Date[]) => {
      if (dates.length !== 2) return "";
      const day1 = dates[0]!.getDate();
      const month1 = dates[0]!.getMonth() + 1;
      const year1 = dates[0]!.getFullYear();

      const day2 = dates[1]!.getDate();
      const month2 = dates[1]!.getMonth() + 1;
      const year2 = dates[1]!.getFullYear();

      return `${day1}/${month1}/${year1} - ${day2}/${month2}/${year2}`;
    };

    const handleDateSelect = (modelDates: Date[]) => {
      emit("selected", modelDates);
    };

    return { date, format, handleDateSelect };
  },
});
</script>
