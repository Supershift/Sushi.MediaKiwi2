import "reflect-metadata";
import App from "./App.vue";
import { createApp } from "vue";
import { msalConfig } from "./authConfig";
import mediakiwi from "@supershift/mediakiwi-vue";

// Import mediakiwi stylesheet AFTER vuetify to override
import "@supershift/mediakiwi-vue/dist/mediakiwi-vue.css";

import { getFakes } from "./fakes/getFakes";
import { fetchSettings } from "./services/settings";

// TODO; Push to store?
const settings = await fetchSettings();

const useFakes = settings?.mediaKiwi?.useFakes;
const useLocalApi = settings?.mediaKiwi?.useLocalApi;

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

// create mediakiwi options
const mediaKiwiOptions: mediakiwi.IMediakiwiVueOptions = {
  apiBaseUrl: useLocalApi ? "https://localhost:7223/mediakiwi/api" : "https://mediakiwi-sample-api-dev.azurewebsites.net/mediakiwi/api",
  modules: modules,
  msalConfig: msalConfig,
  serviceRegistrations: useFakes ? getFakes() : undefined,
};

// install mediakiwi
app.use(mediakiwi, mediaKiwiOptions);

app.mount("#app");
