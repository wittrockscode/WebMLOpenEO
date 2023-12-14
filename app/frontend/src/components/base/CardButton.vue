<template lang="pug">
button.rounded.bg-ml-dark.text-ml-text.p-1.transition-2.hover-shadow.form-item(
  :id="id"
  :class="classString"
  v-text="value"
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
  },
  emits: ["click"],
  setup(props) {

    const classString = computed(() => `hover:bg-ml-blue hover:text-ml-black ${props.fullW ? 'w-full' : ''} ${props.completed ? 'form-completed' : ''}`);

    return { classString };
  },
});
</script>
