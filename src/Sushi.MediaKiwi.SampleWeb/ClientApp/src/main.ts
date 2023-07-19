import "reflect-metadata";
import App from "./App.vue";
import { createApp } from "vue";
import mediakiwi, { createAxiosClient } from "@supershift/mediakiwi-vue";

// Import mediakiwi stylesheet AFTER vuetify to override
import "@supershift/mediakiwi-vue/dist/mediakiwi-vue.css";

import { getSettings } from "./services/settings";
import { container } from "tsyringe";
import { CountryConnector } from "./services/CountryConnector";
import { i18n } from "i18next";

const app = createApp(App);

// Fetch the settings from the function api
const settings = await getSettings();

if (!settings) {
  throw new Error("Failed to retrieve settings");
}

// import all views as models
settings.mediaKiwi.modules = import.meta.glob("./views/**/*.vue");

// i18next options
settings.mediaKiwi.i18nextOptions = {
  debug: true,
};
settings.mediaKiwi.i18nextCallback = (instance: i18n) => {};

// external cdn links we want to render on runtime
settings.mediaKiwi.links = [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossorigin: true,
  },
  {
    rel: "stylesheet",
    type: "text/css",
    href: "https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/7.2.96/css/materialdesignicons.min.css",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap",
  },
];

// install mediakiwi
app.use(mediakiwi, settings.mediaKiwi);

// register dependencies
const sampleApiAxiosInstance = createAxiosClient(settings.sampleApi.apiBaseUrl);
container.register("SampleApiAxiosInstance", { useValue: sampleApiAxiosInstance });
app.mount("#app");
