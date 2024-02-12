<template lang="pug">
.dropdown-select
  select.rounded.bg-ml-dark.text-ml-text.transition-2.hover-shadow.form-item.w-full.text-center.text-3xl.cursor-pointer.pl-5(
    :id="id"
    :class="`p-0.5 ${completed ? 'form-completed' : ''} ${clicked ? '' : 'hover:bg-ml-blue hover:text-ml-black'}`"
    @change="event => $emit('change', event.target.value)"
    @click="clicked = !clicked"
  )
    option.cursor-pointer(
      v-if="withChoose"
      value=""
      selected
      disabled
    ) Choose
    option.cursor-pointer(
      v-for="(value, index) in values"
      :value="value.value"
      v-text="value.label"
      :selected="withChoose ? false : index === selected"
    )
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from "vue";

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
    withChoose: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["change"],
  setup() {

    const clicked = ref(false);

    return { clicked };
  },
});
</script>

<style scoped>
option {
  background-color: theme("colors.ml-dark") !important;
  color: theme("colors.ml-text") !important;
}
</style>
