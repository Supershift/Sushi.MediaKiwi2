import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { container } from "tsyringe";
import { RouterManager, RouterManagerState } from "../routerManager";
import { RouteGenerator } from "../routeGenerator";
import { IMediakiwiVueOptions } from "../../models/options";
import { createRouter, RouteComponent, RouterOptions, RouteRecordRaw, createWebHistory } from "vue-router";
import { Component } from "vue";
import { type INavigationItem, type IScreen } from "../../models";
import { Configuration } from "@azure/msal-browser";
import * as store from "../../stores/index";
import { createTestingPinia } from "@pinia/testing";

// mock libraries
vi.mock("../routeGenerator");
//vi.mock("../../stores/index");

// default stubs
const modules: Record<string, RouteComponent> = {
  a: <Component>{},
  b: <Component>{},
};
const navigationItems: INavigationItem[] = [<INavigationItem>{ id: 1, screenId: 1, path: "/orders" }, <INavigationItem>{ id: 2, screenId: 2, path: "/customers" }];
const screens: IScreen[] = [<IScreen>{ id: 1, sectionId: 1, componentKey: "a", name: "screen a" }, <IScreen>{ id: 2, sectionId: 1, componentKey: "b", name: "screen b" }];
const options: IMediakiwiVueOptions = {
  modules: modules,
  msalConfig: <Configuration>{},
};

const pinia = createTestingPinia();

describe("RouterManager", () => {
  beforeEach(() => {
    container.reset();
    vi.clearAllMocks();
  });
  it("Should call store on initialize", async () => {
    const router = createRouter(<RouterOptions>{
      routes: [],
      history: createWebHistory(),
    });
    const routeGenerator = vi.mocked(new RouteGenerator());
    routeGenerator.generateRoutes.mockReturnValue([]);
    const routerManager = new RouterManager(options, router, routeGenerator);

    const mkStore = store.useMediakiwiStore();

    await routerManager.Initialize();

    expect(routerManager.IsInitialized).toBe(RouterManagerState.Initialized);
    expect(mkStore.init).toHaveBeenCalledOnce();
  });
  it("Should reuse promise on second time calling initialize", async () => {
    const router = createRouter(<RouterOptions>{
      routes: [],
      history: createWebHistory(),
    });
    const routeGenerator = vi.mocked(new RouteGenerator());
    routeGenerator.generateRoutes.mockReturnValue([]);

    const initSpy = vi.spyOn(RouterManager.prototype as any, "initializeManager");

    const routerManager = new RouterManager(options, router, routeGenerator);

    const promise1 = routerManager.Initialize();
    const promise2 = routerManager.Initialize();
    expect(initSpy).toHaveBeenCalledOnce();
  });

  it("Should remove old routes marked as 'from server'", () => {
    const existingRoutes: RouteRecordRaw[] = [
      { name: "temp", component: {}, path: "/somePath", meta: { isFromServer: true } },
      { name: "always", component: {}, path: "/anotherPath", meta: { isFromServer: false } },
    ];

    const router = createRouter(<RouterOptions>{
      routes: existingRoutes,
      history: createWebHistory(),
    });

    const routeGenerator = vi.mocked(new RouteGenerator());
    routeGenerator.generateRoutes.mockReturnValue([]);
    const routerManager = new RouterManager(options, router, routeGenerator);

    // act
    routerManager.updateRoutes(modules, navigationItems, screens);

    // assert
    const routes = router.getRoutes();

    expect(routes).length(1);
    expect(routes.some((x) => x.name == "temp") == false);
    expect(routes.every((x) => x.name == "always"));
  });
});
