import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import OlMapTifTest from "@/components/map/OlMapTifBlob.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/result",
      name: "result",
      component: OlMapTifTest
    },
  ],
});

export default router;
