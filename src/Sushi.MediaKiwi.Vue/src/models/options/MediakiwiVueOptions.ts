import { RouteComponent, RouteRecordRaw } from "vue-router";
import { Configuration } from "@azure/msal-browser";
import { VuetifyOptions } from "vuetify/lib/framework.mjs";
import { IMediakiwiServiceRegistrations } from "./IMediakiwiServiceRegistrations";

export interface MediakiwiVueOptions {
  /** Base url for the MediaKiwi API, e.g. https://portal.mydomain.com/mediakiwi/api */
  apiBaseUrl: string;
  modules: Record<string, RouteComponent>;
  customRoutes?: RouteRecordRaw[];
  msalConfig: Configuration;
  /** Override default vuetify options. Provided object will be merged with default vuetify options. */
  vuetifyOptions?: VuetifyOptions;
  /** Exposes classes which can be injected. Provide your implementation for interfaces here. */
  serviceRegistrations?: IMediakiwiServiceRegistrations;
}
