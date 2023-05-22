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

// load fonts
const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ "webfontloader");

webFontLoader.load({
  google: {
    families: ["Roboto:100,300,400,500,700,900&display=swap"],
  },
});

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
settings.mediaKiwi.i18nextCallback = (instance: i18n) => {
  // below will be replaced with a method to load translations from a backend
  if (instance.options.resources) {
    instance.options.resources.en.Home = {
      Header: "Home page",
      Main: "Welcome to MediaKiwi 2.0!",
    };
    instance.options.resources.nl.Home = {
      Header: "Landings pagina",
      Main: "Welkom bij MediaKiwi 2.0!",
    };
  }
};

// install mediakiwi
app.use(mediakiwi, settings.mediaKiwi);

// register dependencies
const sampleApiAxiosInstance = createAxiosClient(settings.sampleApi.apiBaseUrl);
container.register("SampleApiAxiosInstance", { useValue: sampleApiAxiosInstance });
app.mount("#app");
