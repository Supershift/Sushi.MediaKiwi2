import { RouteComponent, RouteRecordRaw } from "vue-router";
import { Configuration } from "@azure/msal-browser";
import { VuetifyOptions } from "vuetify/lib/framework.mjs";

export interface IMediakiwiVueOptions {
  modules: Record<string, RouteComponent>;
  customRoutes?: RouteRecordRaw[];
  msalConfig: Configuration;
  /** Override default vuetify options. Provided object will be merged with default vuetify options. */
  vuetifyOptions?: VuetifyOptions;
}
