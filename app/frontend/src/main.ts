import "./assets/index.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// OpenLayers
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/styles.css";

// Icons
import mdiVue from "mdi-vue/v3";
import * as mdijs from "@mdi/js";

// Datepicker
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

// For Demo Process
// @ts-ignore
import Vue3Tour from 'vue3-tour';
import 'vue3-tour/dist/vue3-tour.css';

// For Tooltips
import { plugin as VueTippy } from 'vue-tippy';
import 'tippy.js/dist/tippy.css'; // optional for styling

const app = createApp(App);

app.use(router);
app.use(OpenLayersMap);
app.use(Vue3Tour);
app.use(
  VueTippy,
  // optional
  {
    directive: 'tippy', // => v-tippy
    component: 'tippy', // => <tippy/>
    componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
    defaultProps: {
      placement: 'auto-end',
      allowHTML: true,
      delay: [1000, null],
    }, // => Global default options * see all props
  }
);

app.use(mdiVue, {
  icons: mdijs,
});

app.component("VueDatePicker", VueDatePicker);

app.mount("#app");
