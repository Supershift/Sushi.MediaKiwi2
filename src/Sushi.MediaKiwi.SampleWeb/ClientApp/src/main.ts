import "reflect-metadata";
import App from "./App.vue";
import { createApp } from "vue";
import mediakiwi, { createAxiosClient, mediakiwiIconAliases } from "@supershift/mediakiwi-vue";

// Import the mediakiwi stylesheet
import "@supershift/mediakiwi-vue/styles";

import { getSettings } from "./services/settings";
import { container } from "tsyringe";
import { i18n } from "i18next";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mdiAccountCheckOutline, mdiTestTube } from "@mdi/js";

const app = createApp(App);

// Fetch the settings from the function api
const settings = await getSettings();

if (!settings) {
  throw new Error("Failed to retrieve settings");
}

settings.mediaKiwi.title = "MediaKiwi 2.0 - SampleWeb";

// import all views as models
settings.mediaKiwi.modules = import.meta.glob("./views/**/*.vue");

// i18next options
settings.mediaKiwi.i18nextOptions = {
  debug: true,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
settings.mediaKiwi.i18nextCallback = (instance: i18n) => {};

//install some additional icons (demo)
settings.mediaKiwi.vuetifyOptions = {
  icons: {
    defaultSet: "mdi",
    aliases: {
      ...aliases, // add the default aliases
      ...mediakiwiIconAliases, // add the already known mediakiwi aliases
      accountCheckOutline: mdiAccountCheckOutline, // add your own aliases
      testTube: mdiTestTube, // add your own aliases
    },
    sets: {
      mdi,
    },
  },
};

// install mediakiwi
app.use(mediakiwi, settings.mediaKiwi);

// register dependencies
const sampleApiAxiosInstance = createAxiosClient(settings.sampleApi.apiBaseUrl);
container.register("SampleApiAxiosInstance", { useValue: sampleApiAxiosInstance });
app.mount("#app");
