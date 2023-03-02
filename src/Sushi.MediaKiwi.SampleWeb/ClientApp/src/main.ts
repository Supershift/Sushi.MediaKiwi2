import App from "./App.vue";

import { createApp, markRaw } from "vue";

import router from "./router";

import pinia from "./stores/pinia";
import vuetify from "./vuetify"

const app = createApp(App);

// add pinia store first
app.use(pinia);

// add vuetify
app.use(vuetify);

// add routing
app.use(router);

// mount when we are ready with the routes
router.isReady().then(() =>{
  app.mount("#app");
});
