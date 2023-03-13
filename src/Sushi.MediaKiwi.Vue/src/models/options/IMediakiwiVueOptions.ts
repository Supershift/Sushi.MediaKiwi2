import { RouteComponent, RouteRecordRaw } from "vue-router";
import { Configuration } from "@azure/msal-browser";
import { VuetifyOptions } from "vuetify/lib/framework.mjs";
import { constructor } from "tsyringe/dist/typings/types";
import { type INavigationConnector } from "@/services";

export interface IMediakiwiServiceRegistrations {
  navigationConnector?: constructor<INavigationConnector>;
}

export interface IMediakiwiVueOptions {
  modules: Record<string, RouteComponent>;
  customRoutes?: RouteRecordRaw[];
  msalConfig: Configuration;
  /** Override default vuetify options. Provided object will be merged with default vuetify options. */
  vuetifyOptions?: VuetifyOptions;
  /** Exposes classes which can be injected. Provide your implementation for interfaces here. */
  serviceRegistrations?: IMediakiwiServiceRegistrations;
}
