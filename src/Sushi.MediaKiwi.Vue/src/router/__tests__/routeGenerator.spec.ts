import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { container } from "tsyringe";
import { RouteGenerator } from "../routeGenerator";
import { RouteComponent } from "vue-router";
import { Component } from "vue";
import type { NavigationItem, View } from "../../models";

// mock libraries
vi.mock("vue-router");

// default stubs
const modules: Record<string, RouteComponent> = {
  a: <Component>{},
  b: <Component>{},
};
const navigationItems: NavigationItem[] = [
  <NavigationItem>{ id: 1, viewId: "OrderView", path: "/orders", name: "Order", sectionId: 1 },
  <NavigationItem>{ id: 2, viewId: "CustomerView", path: "/customers", name: "Customers", sectionId: 1 },
];
const screens: View[] = [
  <View>{ id: "OrderView", sectionId: 1, componentKey: "a", name: "screen a" },
  <View>{ id: "CustomerView", sectionId: 1, componentKey: "b", name: "screen b" },
];

describe("RouteGenerator", () => {
  beforeEach(() => {
    container.reset();
    vi.clearAllMocks();
  });
  it("Should generate routes for all valid navigation items", () => {
    // arrange
    const routeManager = new RouteGenerator();
    // act
    const routes = routeManager.generateRoutes(modules, navigationItems, screens);

    // assert
    expect(routes).toHaveLength(2);
    expect(routes.every((x) => x.meta?.requiresAuth));
  });
  it("Should add authentication to all routes", () => {
    // arrange
    const routeManager = new RouteGenerator();
    // act
    const routes = routeManager.generateRoutes(modules, navigationItems, screens);

    // assert
    expect(routes.every((x) => x.meta?.requiresAuth));
  });
  it("Should mark all routes as from server", () => {
    // arrange
    const routeManager = new RouteGenerator();
    // act
    const routes = routeManager.generateRoutes(modules, navigationItems, screens);

    // assert
    expect(routes.every((x) => x.meta?.isFromServer));
  });
});
