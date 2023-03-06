import App from "./App.vue";

import { createApp, markRaw } from "vue";

import mediakiwi from "@supershift/mediakiwi-vue";

import vuetify from "./vuetify"

const app = createApp(App);

// add vuetify
app.use(vuetify);

const modules = import.meta.glob("./components/**/*.vue");

app.use(mediakiwi, {
  modules,
});

app.mount("#app");