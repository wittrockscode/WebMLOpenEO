<template lang="pug">
p.card-text.mx-5.font-semibold(v-text="value" :class="justify_position")
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import type { PropType } from "vue";

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    position: {
      type: String as PropType<"left" | "right" | "center">,
      default: "center",
    },
  },
  setup(props) {
    const justify_position = computed(() => {
      switch (props.position) {
        case "left":
          return "justify-self-start";
        case "right":
          return "justify-self-end";
        default:
          return "justify-self-center";
      }
    });
    return { justify_position };
  },
});
</script>
