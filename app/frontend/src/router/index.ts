import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import OlMapTifTest from "@/components/map/OlMapTifBlob.vue";
import MapWrapper from "@/components/map/MapWrapper.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      props: true,
    },
    {
      path: "/result",
      name: "result",
      component: OlMapTifTest
    },
    {
      path: "/test",
      name: "test",
      component: MapWrapper,
    }
  ],
});

export default router;
