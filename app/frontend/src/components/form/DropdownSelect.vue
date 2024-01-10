<template lang="pug">
.dropdown-select
  select.rounded.bg-ml-dark.text-ml-text.transition-2.hover-shadow.form-item.w-full.text-center.text-3xl.cursor-pointer(:id="id" class="p-0.5")
    option.cursor-pointer(v-for="(value, index) in values" :value="value" v-text="value.label" :selected="index === selected")
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    values: {
      type: Array as PropType<{ label: string; value: string }[]>,
      required: true,
    },
    selected: {
      type: Number,
      default: 0,
    },
  },
  setup() {

    return { };
  },
});
</script>
