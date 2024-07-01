import "reflect-metadata";
import App from "./App.vue";
import { createApp } from "vue";
import { createAxiosClient } from "@/services";
import { mdiAliases, symbolsAliases } from "@/plugins/icons";
import { MediakiwiVueOptions } from "@/models";
import mediakiwi from "@/framework";

// Import the mediakiwi stylesheet
import "./styles/main.scss";
import { container } from "tsyringe";
// import { i18n } from "i18next";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mdiAccountCheckOutline, mdiTestTube } from "@mdi/js";

//
import { modules } from "./views/modules";

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
  msalConfig: {
    auth: {
      clientId: import.meta.env.VITE_APP_MEDIAKIWI_MSALCONFIG_AUTH_CLIENTID,
      authority: import.meta.env.VITE_APP_MEDIAKIWI_MSALCONFIG_AUTH_AUTHORITY,
      redirectUri: import.meta.env.VITE_APP_MEDIAKIWI_MSALCONFIG_AUTH_REDIRECTURI,
      postLogoutRedirectUri: import.meta.env.VITE_APP_MEDIAKIWI_MSALCONFIG_AUTH_POSTLOGOUTREDIRECTURI,
    },
  },
  // import all views as models
  modules: {
    ...import.meta.glob("./views/**/*.vue"),
    ...modules,
  },
  dateFormatOptions: {
    date: { year: "numeric", month: "2-digit", day: "2-digit" }, // Example "05/31/2023" or "05-31-2023"
    time: { hour: "2-digit", minute: "2-digit" }, // Example 09:50 AM or 21:50
  },
  identity: {
    scopes: [`api://${import.meta.env.VITE_APP_MEDIAKIWI_MSALCONFIG_AUTH_CLIENTID}/access_via_approle_assignments`],
  },
  signIn: {
    image: './sample/assets/basic-unsplash.jpg',
  }
};

// Create the app
const app = createApp(App);

// install mediakiwi
app.use(mediakiwi, mediakiwiOptions);

// register dependencies
const sampleApiAxiosInstance = createAxiosClient(import.meta.env.VITE_APP_SAMPLEAPI_APIBASEURL);
container.register("SampleApiAxiosInstance", { useValue: sampleApiAxiosInstance });
app.mount("#app");
