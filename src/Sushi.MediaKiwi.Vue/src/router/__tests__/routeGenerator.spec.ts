import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { RouteGenerator } from "../routeGenerator";
import { RouteComponent } from "vue-router";
import { Component } from "vue";
import { NavigationTree, type NavigationItem, type Section } from "@/models/navigation";

// mock libraries
vi.mock("vue-router");

// default stubs
const modules: Record<string, RouteComponent> = {
  a: <Component>{},
  b: <Component>{},
};
const section: Section = { id: "1", name: "Admin Section", roles: ["admin"], items: [] };
const navigationItems: NavigationItem[] = [
  <NavigationItem>{ id: "1", componentKey: "a", name: "Order", section: section, children: [] },
  <NavigationItem>{ id: "2", componentKey: "b", name: "Customers", section: section, children: [] },
];
section.items = navigationItems;
const tree = new NavigationTree([section]);

describe("RouteGenerator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Should generate routes for all valid navigation items", () => {
    // arrange
    const routeManager = new RouteGenerator();
    // act
    const routes = routeManager.generateRoutes(modules, tree);

    // assert
    expect(routes).toHaveLength(3); // 2 navigation items + 1 default catchall route
    expect(routes.every((x) => x.meta?.requiresAuth));
  });
  it("Should add authentication to all routes", () => {
    // arrange
    const routeManager = new RouteGenerator();
    // act
    const routes = routeManager.generateRoutes(modules, tree);

    // assert
    expect(routes.every((x) => x.meta?.requiresAuth));
  });
  it("Should mark all routes as from server", () => {
    // arrange
    const routeManager = new RouteGenerator();
    // act
    const routes = routeManager.generateRoutes(modules, tree);

    // assert
    expect(routes.every((x) => x.meta?.isFromServer));
  });
});
