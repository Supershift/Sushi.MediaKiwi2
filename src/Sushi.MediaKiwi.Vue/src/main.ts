import App from "./App.vue";

import { createApp, markRaw } from "vue";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as VComponents from "vuetify/components";
import * as VDirectives from "vuetify/directives";

import { md3 } from "vuetify/blueprints";

import { mdi, aliases } from "vuetify/iconsets/mdi";

import router from "./router";

import { createPinia, type PiniaPluginContext } from "pinia";

const pinia = createPinia();

const app = createApp(App);

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
    defaultTheme: "dark"
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    }
  }
});

// add a property named `secret` to every store that is created
// after this plugin is installed this could be in a different file
pinia.use(({ store }) => {
  store.hello = "Welcome to Mediakiwi 2.0";
  store.router = router;
});

app.use(pinia);

app.use(vuetify);

// add routing
app.use(router);

app.mount("#app");
