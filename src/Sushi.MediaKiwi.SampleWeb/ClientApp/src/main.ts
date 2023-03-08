import App from "./App.vue";

import { createApp } from "vue";
import { msalConfig } from "./authConfig";
import mediakiwi from "@supershift/mediakiwi-vue";
import vuetify from "./plugins/vuetify";

const app = createApp(App);

// add vuetify
app.use(vuetify);

// import all views as models
const modules = import.meta.glob("./views/**/*.vue");

// create mediakiwi options, with modules
const mediaKiwiOptions = {
  modules: modules,
  msalConfig: msalConfig,
};

// install mediakiwi
app.use(mediakiwi, mediaKiwiOptions);

app.mount("#app");
