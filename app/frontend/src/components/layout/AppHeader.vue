<template lang="pug">
header#header
  .header-content.bg-ml-black.text-ml-text.flex
    .header-image
      RouterLink(to="/")
        img.p-4.max-w-xs.w-52(:src="LogoTransparent")
    .header-links.flex.flex-row.justify-start.gap-20.ml-16.items-center.text-lg
      HeaderLink(value="Home" route="/")
      HeaderLink(value="About" route="/about")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LogoTransparent from "@/assets/logo-transparent.png";
import HeaderLink from "../base/HeaderLink.vue";

export default defineComponent({
  components: {
    HeaderLink,
  },
  setup() {
    return { LogoTransparent };
  },
});
</script>

<style scoped>
#header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>
