import "reflect-metadata";
import App from "./App.vue";
import { createApp } from "vue";
import { mdiAliases, symbolsAliases } from "@/plugins/icons";
import type { MediakiwiVueOptions } from "@/models";
import type { MediakiwiIdentity } from "@/models/options/MediakiwiIdentity";
import mediakiwi from "@/framework";

// Import the mediakiwi stylesheet
import "./styles/main.scss";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mdiAccountCheckOutline, mdiTestTube } from "@mdi/js";

import { useEntraSettings } from "@/composables/useEntraSettings";
import type { Configuration } from "@azure/msal-browser";

import navigation from "./navigation/SimpleNavigationProvider";
import { globalConfiguration } from "./plugin/GlobalConfiguration";

import emptyStateFilterSvg from "./assets/empty-state-filter.svg";

// add mediakiwi
const mediakiwiOptions: MediakiwiVueOptions = {
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
    ...globalConfiguration,
  },
  apiBaseUrl: import.meta.env.VITE_APP_MEDIAKIWI_APIBASEURL,
  navigationProvider: navigation,
  msalConfig: <Configuration>{},
  identity: <MediakiwiIdentity>{},
  parseQueryStringArray: true,
  // import all views as models
  modules: {
    ...import.meta.glob("./**/views/**/*.vue"),
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
    view: {
      redirectAfterDelete: true,
    },
    dialog: {
      closeOnSubmit: true,
      resetOnSubmit: true,
    },
    sideSheet: {
      resetOnSubmit: true,
      closeOnSubmit: true,
    },
  },
  emptyState: {
    filter: {
      image: emptyStateFilterSvg,
      headline: false,
      title: "Oops! No results found matching your criteria.",
      text: "Try changing your filter criteria to get more results.",
    },
  },
  filterOptions: {
    shortKey: false, // Default is already true, this is for demo. It toggles CTRL+F shortcut usage. Set to false to disable.
  },
};

const { fillEntraSettings } = useEntraSettings(import.meta.env.VITE_APP_MEDIAKIWI_APIBASEURL);
const mediakiwiOptionsWithEntra = await fillEntraSettings(mediakiwiOptions);

// Create the app
const app = createApp(App);

// install mediakiwi
app.use(mediakiwi, mediakiwiOptionsWithEntra);

app.mount("#app");
