<template lang='pug'>
main.bg-ml-dark.w-screen.h-screen
  AppHeader
  RouterView
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue'

export default defineComponent({
  components:{
    AppHeader,
    RouterView,
  },
  setup() {

    return { };
  },
});
</script>
