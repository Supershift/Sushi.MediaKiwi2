import { injectable, inject } from "tsyringe";
import { useMediakiwiStore } from "@/stores";
import { type IMediakiwiVueOptions } from "../models/options/IMediakiwiVueOptions";
import { type Router, RouteComponent, RouteRecordRaw } from "vue-router";
import { INavigationItem, IScreen } from "@/models";

export enum RouterManagerState {
  Empty = 0,
  Initialized = 1,
  Failed = 2,
}

@injectable()
export class RouterManager {
  constructor(@inject("MediakiwiOptions") private options: IMediakiwiVueOptions, @inject("Router") private router: Router) {}

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
    navigationItems.forEach((navigationItem: INavigationItem) => {
      // if the navigation item points to a screen, get the screen
      if (navigationItem.screenId != null && navigationItem.screenId !== undefined) {
        const screen = screens.find((x: IScreen) => x.id == navigationItem.screenId);

        if (screen != null && screen !== undefined && modules) {
          // find the module referenced by the screen
          const module = modules[screen.componentKey];
          if (module !== undefined) {
            // add a route to the module
            const route = <RouteRecordRaw>{
              path: navigationItem.path,
              name: navigationItem.id.toString(),
              component: module,
              meta: {
                isFromServer: true,
                requiresAuth: true,
              },
            };
            this.router.addRoute(route);
          } else {
            // no module found, give a warning
            console.warn(`No module found for screenID: ${screen.id}, component key: ${screen.componentKey}`);
          }
        }
      }
    });
  }

  /** Calls stores and updates routes based on store data */
  private async initializeManager() {
    try {
      // tell store to load data from sources
      const store = useMediakiwiStore();
      await store.init();

      // apply loaded data to router
      this.updateRoutes(this.options.modules, store.navigationItems, store.screens);
      
      this._isInitialized = RouterManagerState.Initialized;    
    } catch (error) {
      this._isInitialized = RouterManagerState.Failed;
    }
    return this._isInitialized;
  }
}
