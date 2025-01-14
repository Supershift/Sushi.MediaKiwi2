import { MediakiwiVueOptions } from "@/models";
import { RouterManager } from "@/router/routerManager";
import { setPageTitle } from "@/router/setPageTitle";
import { App } from "vue";
import { Router } from "vue-router";

export function registerRouter(app: App<any>, router: Router, options: MediakiwiVueOptions) {
  app.provide('RouterManager', new RouterManager(options, router))

  // Add method to set page title
  setPageTitle(router);
}
