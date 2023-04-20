import "reflect-metadata";
import App from "./App.vue";
import { createApp } from "vue";
import { msalConfig } from "./authConfig";
import mediakiwi from "@supershift/mediakiwi-vue";
import * as mk from "@supershift/mediakiwi-vue";

// Import mediakiwi stylesheet AFTER vuetify to override
import "@supershift/mediakiwi-vue/dist/mediakiwi-vue.css";

import { getFakes } from "./fakes/getFakes";
import { fetchSettings } from "./services/settings";

const app = createApp(App);

// load fonts
const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ "webfontloader");

webFontLoader.load({
  google: {
    families: ["Roboto:100,300,400,500,700,900&display=swap"],
  },
});

// import all views as models
const modules = import.meta.glob("./views/**/*.vue");

// Fetch the settings from the function api
const settings = await fetchSettings();
const useFakes = settings?.mediaKiwi?.useFakes;
const apiBaseUrl = settings?.mediaKiwi?.apiBaseUrl;

// create mediakiwi options
const mediaKiwiOptions: mk.MediakiwiVueOptions = {
  apiBaseUrl: apiBaseUrl!,
  modules: modules,
  msalConfig: msalConfig,
  serviceRegistrations: useFakes ? getFakes() : undefined,
};

// install mediakiwi
app.use(mediakiwi, mediaKiwiOptions);

app.mount("#app");
