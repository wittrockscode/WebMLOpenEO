<template lang="pug">
button.rounded.bg-ml-dark.text-ml-text.p-1.transition-2.hover-shadow.form-item(
  :id="id"
  :class="classString"
  v-text="value"
  :disabled="disabled"
  @click="$emit('click')"
)
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
  },
  emits: ["click"],
  setup(props) {

    const classString = computed(() =>
      `${props.fullW ? 'w-full' : ''} ${props.error ? 'form-error' : props.completed ? 'form-completed' : ''} ${props.disabled ? 'form-disabled' : 'hover:bg-ml-blue hover:text-ml-black'}`
    );

    return { classString };
  },
});
</script>
