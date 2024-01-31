<template lang="pug">
header#header
  .header-content.bg-ml-black.text-ml-text.flex
    .header-image
      RouterLink(to="/")
        img.p-4.max-w-xs.w-52(:src="LogoTransparent")
    .header-links.flex.flex-row.justify-start.gap-20.ml-16.items-center.text-lg
      HeaderLink(value="Home" route="/")
      HeaderLink(value="About" route="/about")
      a.header-link.text-ml-text(:href="swaggerLink") Documentation
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
    const swaggerLink = import.meta.env.VITE_ENV === "production" ?
      "http://ec2-54-70-150-226.us-west-2.compute.amazonaws.com/swagger" :
      "http://localhost:3000/swagger";
    return { LogoTransparent, swaggerLink };
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
