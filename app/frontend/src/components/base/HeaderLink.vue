<template lang="pug">
.header-link.text-ml-text
  RouterLink(:to="route")
    h4(v-text="value" :class="font_weight ? 'font-semibold' : ''")
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const current_route = useRoute();
    const font_weight = computed(() => current_route.path === props.route);

    return { font_weight };
  },
});
</script>
