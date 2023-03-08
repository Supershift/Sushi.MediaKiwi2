import App from "./App.vue";

import { createApp } from "vue";

import mediakiwi from "@supershift/mediakiwi-vue";
import vuetify from "./plugins/vuetify";

const app = createApp(App);

// import all views as models
const modules = import.meta.glob("./views/**/*.vue");

// add vuetify
app.use(vuetify);

app.use(mediakiwi, {
  modules,
});

app.mount("#app");
