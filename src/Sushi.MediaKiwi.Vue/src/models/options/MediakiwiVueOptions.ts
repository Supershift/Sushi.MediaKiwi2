import { RouteComponent, RouteRecordRaw } from "vue-router";
import { Configuration } from "@azure/msal-browser";
import { IMediakiwiServiceRegistrations } from "./IMediakiwiServiceRegistrations";
import { InitOptions, i18n } from "i18next";
import { MediakiwiIdentity } from "./MediakiwiIdentity";
import { VuetifyOptions } from "vuetify";
import { MediakiwiTableOptions } from "./MediakiwiTableOptions";
import { MediaKiwiFormOptions } from "./MediaKiwiFormOptions";
import { MediakiwiSigninConfigurations } from "./MediakiwiSignInConfigurations";
import { ComponentPublicInstance } from "vue";

export interface MediakiwiVueOptions {
  /** Base url for the MediaKiwi API, e.g. https://portal.mydomain.com/mediakiwi/api */
  apiBaseUrl: string;
  modules: Record<string, RouteComponent>;
  customRoutes?: RouteRecordRaw[];
  msalConfig: Configuration;
  identity: MediakiwiIdentity;
  /** Override default vuetify options. Provided object will be merged with default vuetify options. */
  vuetifyOptions?: VuetifyOptions;
  /** Exposes classes which can be injected. Provide your implementation for interfaces here. */
  serviceRegistrations?: IMediakiwiServiceRegistrations;
  /** Override default i18next options. Provided object will be merged with default options. */
  i18nextOptions?: InitOptions;
  i18nextCallback?: (instance: i18n) => void;
  /** Override default {@link Intl.DateTimeFormatOptions} for date, time and month */
  dateFormatOptions?: {
    date?: Intl.DateTimeFormatOptions;
    time?: Intl.DateTimeFormatOptions;
    month?: Intl.DateTimeFormatOptions;
  };
  emptyState?: {
    image?: string;
    hideImage?: boolean;
  };
  /** Options for the sign in screen background*/
  signIn?: {
    [key: string]: MediakiwiSigninConfigurations;
  };
  /** Global options used for MkTable */
  tableOptions?: MediakiwiTableOptions;
  formOptions?: MediaKiwiFormOptions;
  /** Global errorhandler, see {@link https://vuejs.org/api/application.html#app-config-errorhandler} */
  globalErrorHandler?: (err: any, instance?: ComponentPublicInstance | null, info?: string) => Promise<void>;
}
