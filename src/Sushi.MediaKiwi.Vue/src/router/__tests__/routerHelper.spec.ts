import "reflect-metadata";
import { describe, it, expect, beforeEach } from "vitest";
import { container } from "tsyringe";
import { RouterHelper } from "../routerHelper";
import { IMediakiwiVueOptions } from "../../models/options";
import { createRouter, RouteComponent, RouterOptions, type RouteRecordRaw, createWebHistory } from "vue-router";
import { Component } from "vue";
import { type INavigationItem, type IScreen } from "../../models";

// default stubs
const modules: Record<string, RouteComponent> = {
  a: <Component>{},
  b: <Component>{},
};
const navigationItems: INavigationItem[] = [<INavigationItem>{ id: 1, screenId: 1, path: "/orders" }, <INavigationItem>{ id: 2, screenId: 2, path: "/customers" }];
const screens: IScreen[] = [<IScreen>{ id: 1, sectionId: 1, componentKey: "a", name: "screen a" }, <IScreen>{ id: 2, sectionId: 1, componentKey: "b", name: "screen b" }];

describe("RouteGenerator", () => {
  beforeEach(() => {
    container.reset();
  });
  it("Should generate routes for all valid navigation items", () => {
    // arrange
    const routeGenerator = new RouterHelper();
    const router = createRouter(<RouterOptions>{
      routes: <RouteRecordRaw[]>[],
      history: createWebHistory(),
    });

    // act
    routeGenerator.updateRoutes(router, modules, navigationItems, screens);

    // assert
    const routes = router.getRoutes();
    expect(routes).toHaveLength(2);
    expect(routes.every((x) => x.meta?.requiresAuth));
  });
  it("Should add authentication to all routes", () => {
    // arrange
    const routeGenerator = new RouterHelper();
    const router = createRouter(<RouterOptions>{
      routes: <RouteRecordRaw[]>[],
      history: createWebHistory(),
    });

    // act
    routeGenerator.updateRoutes(router, modules, navigationItems, screens);

    // assert
    const routes = router.getRoutes();
    expect(routes.every((x) => x.meta?.requiresAuth));
  });
  it("Should mark all routes as from server", () => {
    // arrange
    const routeGenerator = new RouterHelper();
    const router = createRouter(<RouterOptions>{
      routes: <RouteRecordRaw[]>[],
      history: createWebHistory(),
    });

    // act
    routeGenerator.updateRoutes(router, modules, navigationItems, screens);

    // assert
    const routes = router.getRoutes();

    expect(routes.every((x) => x.meta?.isFromServer));
  });
  it("Should remove old routes marked as 'from server'", () => {
    // arrange
    const routeGenerator = new RouterHelper();
    const router = createRouter(<RouterOptions>{
      routes: <RouteRecordRaw[]>[{ path: "/me", meta: { isFromServer: true }, name: "temp", component: {} }],
      history: createWebHistory(),
    });

    // act
    routeGenerator.updateRoutes(router, modules, navigationItems, screens);

    // assert
    const routes = router.getRoutes();

    expect(routes.some((x) => x.name == "temp") == false);
  });
});
