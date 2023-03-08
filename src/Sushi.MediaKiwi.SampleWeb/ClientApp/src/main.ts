import App from "./App.vue";

import { createApp } from "vue";
import { msalConfig } from "./authConfig";
import mediakiwi from "@supershift/mediakiwi-vue";
import vuetify from "./plugins/vuetify";

const app = createApp(App);

const modules = import.meta.glob("./components/**/*.vue");

// add vuetify
app.use(vuetify);

// create mediakiwi options, with modules
const mediaKiwiOptions = {
  modules: import.meta.glob("./components/**/*.vue"),
  msalConfig: msalConfig,
};

// install mediakiwi
app.use(mediakiwi, mediaKiwiOptions);

app.mount("#app");
