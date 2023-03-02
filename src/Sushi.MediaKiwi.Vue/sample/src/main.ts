import App from "./App.vue";

import { createApp, markRaw } from "vue";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";

import { md3 } from "vuetify/blueprints";

import { mdi, aliases } from "vuetify/iconsets/mdi";

// import router from "./router";
import mediakiwi from "@supershift/mediakiwi-vue";

import { createPinia, type PiniaPluginContext } from "pinia";

const pinia = createPinia();

// load fonts
const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ "webfontloader");

webFontLoader.load({
  google: {
    families: ["Roboto:100,300,400,500,700,900&display=swap"],
  },
});

const vuetify = createVuetify({
  blueprint: md3,
  components: VComponents,
  directives: VDirectives,
  theme: {
    defaultTheme: "dark",
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App);

app.use(pinia);

app.use(vuetify);

const modules = import.meta.glob("./components/**/*.vue");

app.use(mediakiwi, {
  modules,
});

app.mount("#app");
