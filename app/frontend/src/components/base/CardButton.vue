<template lang="pug">
button.rounded.bg-ml-dark.text-ml-text.p-1.transition-2.hover-shadow.form-item.flex(
  :id="id"
  :class="classString"
  :disabled="disabled"
  @click="$emit('click')"
)
  .content(v-if="!loading")
    span(v-text="value")
    mdicon.ml-3.self-center(v-if="icon" :name="iconText")
  .lds-ring(v-else)
    div
    div
    div
    div
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

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
    fullW: {
      type: Boolean,
      default: false,
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
    icon: {
      type: Boolean,
      default: false,
    },
    iconText: {
      type: String,
      default: "",
    },
    alignText: {
      type: String,
      default: "center",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(props) {

    const classString = computed(() =>
      `${props.fullW ? 'w-full' : ''} ${props.error ? 'form-error' : props.completed ? 'form-completed' : ''} ${props.disabled ? 'form-disabled' : 'hover:bg-ml-blue hover:text-ml-black'} ${props.icon ? 'justify-between' : 'justify-' + props.alignText}`
    );

    return { classString };
  },
});
</script>

<style scoped>
@import '@/assets/small-spinner.css';
</style>
