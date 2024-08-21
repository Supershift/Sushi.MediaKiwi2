import "reflect-metadata";
import App from "./App.vue";
import { createApp } from "vue";
import { createAxiosClient } from "@/services";
import { mdiAliases, symbolsAliases } from "@/plugins/icons";
import { MediakiwiVueOptions } from "@/models";
import { MediakiwiIdentity } from "@/models/options/MediakiwiIdentity";
import mediakiwi from "@/framework";

// Import the mediakiwi stylesheet
import "./styles/main.scss";
import { container } from "tsyringe";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mdiAccountCheckOutline, mdiTestTube } from "@mdi/js";

import { modules } from "./views/modules";
import { useEntraSettings } from "@/composables/useEntraSettings";
import { Configuration } from "@azure/msal-browser";

// add mediakiwi
const mediakiwiOptions = <MediakiwiVueOptions>{
  // configure the vuetify options with the additional icon aliases
  vuetifyOptions: {
    icons: {
      defaultSet: "mdi",
      aliases: {
        ...aliases, // add the default aliases
        ...mdiAliases,
        ...symbolsAliases, // add the already known mediakiwi aliases
        accountCheckOutline: mdiAccountCheckOutline, // add your own aliases
        testTube: mdiTestTube, // add your own aliases
      },
      sets: {
        mdi,
      },
    },
  },
  apiBaseUrl: import.meta.env.VITE_APP_MEDIAKIWI_APIBASEURL,
  msalConfig: <Configuration>{},
  identity: <MediakiwiIdentity>{},
  // import all views as models
  modules: {
    ...import.meta.glob("./views/**/*.vue"),
    ...modules,
  },
  dateFormatOptions: {
    date: { year: "numeric", month: "2-digit", day: "2-digit" }, // Example "05/31/2023" or "05-31-2023"
    time: { hour: "2-digit", minute: "2-digit" }, // Example 09:50 AM or 21:50
  },
  signIn: {
    dark: {
      image: "./basic-unsplash.jpg",
      color: "green",
    },
    light: {
      image: "./flowers.png",
      color: "rgba(100, 142, 239, 0.6)",
    },
  },
  formOptions: {
    dialog: {
      closeOnSubmit: true,
      resetOnSubmit: true,
    },
    sideSheet: {
      resetOnSubmit: true,
      closeOnSubmit: true,
    },
  },
};

const { fillEntraSettings } = useEntraSettings();
const mediakiwiOptionsWithEntra = await fillEntraSettings(mediakiwiOptions);

// Create the app
const app = createApp(App);

// install mediakiwi
app.use(mediakiwi, mediakiwiOptionsWithEntra);

// register dependencies
const sampleApiAxiosInstance = createAxiosClient(import.meta.env.VITE_APP_SAMPLEAPI_APIBASEURL);
container.register("SampleApiAxiosInstance", { useValue: sampleApiAxiosInstance });
app.mount("#app");
