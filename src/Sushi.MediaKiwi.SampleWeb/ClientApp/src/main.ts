import "reflect-metadata";
import App from "./App.vue";
import { createApp } from "vue";
import mediakiwi, { createAxiosClient, mediakiwiIconAliases, ConfigurationConnector, MediakiwiVueOptions } from "@supershift/mediakiwi-vue";

// Import the mediakiwi stylesheet
import "./styles/main.scss";
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
const mediakiwiOptions = <MediakiwiVueOptions>{ ...settings.mediaKiwi };

// import all views as models
mediakiwiOptions.modules = import.meta.glob("./views/**/*.vue");

// i18next options
mediakiwiOptions.i18nextOptions = {
  debug: true,
};

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

// Change the default date and time format options across the system.
mediakiwiOptions.dateFormatOptions = {
  date: { year: "numeric", month: "2-digit", day: "2-digit" }, // Example "05/31/2023" or "05-31-2023"
  time: { hour: "2-digit", minute: "2-digit" }, // Example 09:50 AM or 21:50
};

// Create the app
const app = createApp(App);

// install mediakiwi
app.use(mediakiwi, mediakiwiOptions);

// register dependencies
const sampleApiAxiosInstance = createAxiosClient(settings.sampleApi.apiBaseUrl);
container.register("SampleApiAxiosInstance", { useValue: sampleApiAxiosInstance });
app.mount("#app");
