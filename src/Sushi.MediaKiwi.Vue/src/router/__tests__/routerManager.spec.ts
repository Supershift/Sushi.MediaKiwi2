import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { RouterManager, RouterManagerState } from "../routerManager";
import { RouteGenerator } from "../routeGenerator";
import { MediakiwiVueOptions } from "../../models";
import { createRouter, RouteComponent, RouterOptions, RouteRecordRaw, createWebHistory } from "vue-router";
import { Component } from "vue";
import { NavigationTree, Section, type NavigationItem } from "../../models/navigation";
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
const section: Section = { id: "1", name: "Admin Section", roles: ["admin"], items: [] };
const navigationItems: NavigationItem[] = [
  { id: "1", componentKey: "a", name: "", section: section, children: [] },
  { id: "2", componentKey: "b", name: "", section: section, children: [] },
];
section.items = navigationItems;
const tree = new NavigationTree([section]);

const options: MediakiwiVueOptions = {
  apiBaseUrl: "",
  modules: modules,
  msalConfig: <Configuration>{},
  identity: <any>{},
};

describe("RouterManager", () => {
  beforeEach(() => {
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
    const routerManager = new RouterManager(options, router);

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

    const routerManager = new RouterManager(options, router);

    routerManager.Initialize();
    routerManager.Initialize();
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
    const routerManager = new RouterManager(options, router);

    // act
    routerManager.updateRoutes(modules, tree);

    // assert
    const routes = router.getRoutes();

    expect(routes).length(1);
    expect(routes.some((x) => x.name == "temp") == false);
    expect(routes.every((x) => x.name == "always"));
  });
});
