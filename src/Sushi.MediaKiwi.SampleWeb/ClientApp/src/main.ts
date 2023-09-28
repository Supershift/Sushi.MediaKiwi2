import "reflect-metadata";
import App from "./App.vue";
import { createApp } from "vue";
import mediakiwi, { createAxiosClient, mediakiwiIconAliases, ConfigurationConnector, MediakiwiVueOptions } from "@supershift/mediakiwi-vue";

// Import the mediakiwi stylesheet
import "@supershift/mediakiwi-vue/styles";
import { container } from "tsyringe";
import { i18n } from "i18next";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mdiAccountCheckOutline, mdiTestTube } from "@mdi/js";
import { SampleWebConfiguration } from "./models/SampleWebConfiguration";

// Fetch the settings from the function api
const connector = new ConfigurationConnector("/api/configuration", import.meta.env.VITE_APP_SETTINGS_BASE_URL);
const settings = await connector.GetAsync<SampleWebConfiguration>();

if (!settings) {
  throw new Error("Failed to retrieve settings");
}

// Create the options object
const mediakiwiOptions: MediakiwiVueOptions = { ...settings.mediaKiwi };

// Set the portal title
mediakiwiOptions.title = "MediaKiwi 2.0 - SampleWeb";

// import all views as models
mediakiwiOptions.modules = import.meta.glob("./views/**/*.vue");

// i18next options
mediakiwiOptions.i18nextOptions = {
  debug: true,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
mediakiwiOptions.i18nextCallback = (instance: i18n) => {};

//install some additional icons (demo)
mediakiwiOptions.vuetifyOptions = {
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

// Create the app
const app = createApp(App);

// install mediakiwi
app.use(mediakiwi, mediakiwiOptions);

// register dependencies
const sampleApiAxiosInstance = createAxiosClient(settings.sampleApi.apiBaseUrl);
container.register("SampleApiAxiosInstance", { useValue: sampleApiAxiosInstance });
app.mount("#app");
