import { RouteComponent, RouteRecordRaw } from "vue-router";
import { Configuration } from "@azure/msal-browser";
import { VuetifyOptions } from "vuetify/lib/framework.mjs";
import { IMediakiwiServiceRegistrations } from "./IMediakiwiServiceRegistrations";
import { InitOptions, i18n } from "i18next";

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
  /** Override default i18next options. Provided object will be merged with default options. */
  i18nextOptions?: InitOptions;
  i18nextCallback?: (instance: i18n) => void;
  /** Sets the title to be displayed in the App bar */
  title?: string;
  /** Sets the logo to be displayed in the App bar */
  logo?: string;
}
