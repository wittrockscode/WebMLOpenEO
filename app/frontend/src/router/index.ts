import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import MapWrapper from "@/components/map/MapWrapper.vue";
import ImpressumView from "@/views/ImpressumView.vue";
import ErrorView from "@/views/ErrorView.vue";

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
      component: MapWrapper
    },
    {
      path: "/about",
      name: "about",
      component: ImpressumView,
    },
    {
      path: "/error",
      name: "error",
      component: ErrorView,
    }
  ],
});

export default router;
