import './assets/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// OpenLayers
import OpenLayersMap from "vue3-openlayers"
import "vue3-openlayers/styles.css"

// Icons
import mdiVue from 'mdi-vue/v3'
import * as mdijs from '@mdi/js'

const app = createApp(App)

app.use(router)
app.use(OpenLayersMap)

app.use(mdiVue, {
  icons: mdijs
})

app.mount('#app')
