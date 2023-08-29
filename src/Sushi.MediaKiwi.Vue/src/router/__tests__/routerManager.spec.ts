import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { container } from "tsyringe";
import { RouterManager, RouterManagerState } from "../routerManager";
import { RouteGenerator } from "../routeGenerator";
import { MediakiwiVueOptions } from "../../models";
import { createRouter, RouteComponent, RouterOptions, RouteRecordRaw, createWebHistory } from "vue-router";
import { Component } from "vue";
import { type NavigationItem, type View } from "../../models";
import { Configuration } from "@azure/msal-browser";
import * as store from "../../stores/index";
import { setActivePinia } from "pinia";
import { createTestingPinia } from "@pinia/testing";

// mock libraries
vi.mock("../routeGenerator");

// default stubs
const modules: Record<string, RouteComponent> = {
  a: <Component>{},
  b: <Component>{},
};
const navigationItems: NavigationItem[] = [
  { id: 1, viewId: "a", path: "/orders", name: "", sectionId: 1 },
  { id: 2, viewId: "b", path: "/customers", name: "", sectionId: 1 },
];
const screens: View[] = [
  { id: "a", sectionId: 1, componentKey: "a", name: "screen a" },
  { id: "b", sectionId: 1, componentKey: "b", name: "screen b" },
];
const options: MediakiwiVueOptions = {
  apiBaseUrl: "",
  modules: modules,
  msalConfig: <Configuration>{},
};

describe("RouterManager", () => {
  beforeEach(() => {
    container.reset();
    vi.clearAllMocks();
    setActivePinia(createTestingPinia());
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
