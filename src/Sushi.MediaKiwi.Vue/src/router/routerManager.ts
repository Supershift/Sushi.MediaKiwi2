import { useMediakiwiStore } from "../stores/index";
import { MediakiwiVueOptions } from "../models/options/MediakiwiVueOptions";
import type { RouteComponent, Router } from "vue-router";
import { NavigationTree } from "@/models/navigation";
import { RouteGenerator } from "./routeGenerator";
import { modules } from "@/views/modules";

export enum RouterManagerState {
  Empty = 0,
  Initialized = 1,
  Failed = 2,
}

export class RouterManager {
  constructor(
    private options: MediakiwiVueOptions,
    private router: Router
  ) { }

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
  public updateRoutes(modules: Record<string, RouteComponent>, navigationTree: NavigationTree): void {
    // remove existing dynamic routes
    const existingRoutes = this.router.getRoutes();
    existingRoutes.forEach((route) => {
      if (route.name && route.meta?.isFromServer) {
        this.router.removeRoute(route.name);
      }
    });

    // add new routes for navigation items
    const routes = new RouteGenerator().generateRoutes(modules, navigationTree);
    routes.forEach((route) => this.router.addRoute(route));
  }

  /** Calls stores and updates routes based on store data */
  private async initializeManager(): Promise<RouterManagerState> {
    try {
      // tell store to load data from sources
      const store = useMediakiwiStore();
      await store.init(this.options);

      // apply loaded data to router
      const allModules = this.getModules();
      this.updateRoutes(allModules, store.navigationTree as NavigationTree);

      this._isInitialized = RouterManagerState.Initialized;
    } catch (error) {
      this._isInitialized = RouterManagerState.Failed;
      throw error;
    }
    return this._isInitialized;
  }

  /** Gets all modules by merging default mk modules with modules provided through mediakiwi options */
  private getModules(): Record<string, RouteComponent> {
    const result = { ...modules, ...this.options.modules };
    return result;
  }
}
