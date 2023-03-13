import "reflect-metadata";
import App from "./App.vue";
import { createApp } from "vue";
import { msalConfig } from "./authConfig";
import mediakiwi from "@supershift/mediakiwi-vue";

// Import mediakiwi stylesheet AFTER vuetify to override
import "@supershift/mediakiwi-vue/dist/mediakiwi-vue.css";

import { NavigationConnector } from "./fakes/NavigationConnector";
import { container } from "tsyringe";

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

// create mediakiwi options, with modules
const mediaKiwiOptions = {
  modules: modules,
  msalConfig: msalConfig,
  inavtype: NavigationConnector,
};

// install mediakiwi
app.use(mediakiwi, mediaKiwiOptions);

app.mount("#app");
