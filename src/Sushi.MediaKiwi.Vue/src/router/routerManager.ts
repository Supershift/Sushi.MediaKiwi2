import { injectable, inject } from "tsyringe";
import { useMediakiwiStore } from "../stores/index";
import { type IMediakiwiVueOptions } from "../models/options/IMediakiwiVueOptions";
import type { RouteComponent } from "vue-router";
import { type Router } from "vue-router";
import { type INavigationItem, type IScreen } from "@/models";
import type { RouteGenerator } from "./routeGenerator";

export enum RouterManagerState {
  Empty = 0,
  Initialized = 1,
  Failed = 2,
}

@injectable()
export class RouterManager {
  constructor(@inject("MediakiwiOptions") private options: IMediakiwiVueOptions, @inject("Router") private router: Router, @inject("RouteGenerator") private routeGenerator: RouteGenerator) {}

  private _initialize?: Promise<RouterManagerState>;
  private _isInitialized: RouterManagerState = RouterManagerState.Empty;

  public get IsInitialized(): RouterManagerState {
    return this._isInitialized;
  }

  /** Initializes the manager by loading from backing stores if not already initialized */
  public async Initialize(): Promise<RouterManagerState> {
    // check if this is the first call
    if (this._initialize === undefined) {
      // start initializing
      this._initialize = this.initializeManager();
    }

    // return the initialization promise
    return await this._initialize;
  }

  /** Forces the manager to initialize, regardless of current state */
  public async ForceInitialize(): Promise<RouterManagerState> {
    this._initialize = this.initializeManager();
    return await this._initialize;
  }

  /** Updates the dynamic routes based on navigation items and modules */
  public updateRoutes(modules: Record<string, RouteComponent>, navigationItems: INavigationItem[], screens: IScreen[]): void {
    // remove existing dynamic routes
    const existingRoutes = this.router.getRoutes();
    existingRoutes.forEach((route) => {
      if (route.name && route.meta?.isFromServer) {
        this.router.removeRoute(route.name);
      }
    });

    // add new routes for navigation items
    const routes = this.routeGenerator.generateRoutes(modules, navigationItems, screens);
    routes.forEach((route) => this.router.addRoute(route));
  }

  /** Calls stores and updates routes based on store data */
  private async initializeManager(): Promise<RouterManagerState> {
    try {
      // tell store to load data from sources
      const store = useMediakiwiStore();
      await store.init();

      // apply loaded data to router
      this.updateRoutes(this.options.modules, store.navigationItems, store.screens);

      this._isInitialized = RouterManagerState.Initialized;
    } catch (error) {
      this._isInitialized = RouterManagerState.Failed;
      throw error;
    }
    return this._isInitialized;
  }
}
