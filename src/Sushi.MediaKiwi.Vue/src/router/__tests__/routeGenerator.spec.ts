import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { container } from "tsyringe";
import { RouteGenerator } from "../routeGenerator";
import { RouteComponent } from "vue-router";
import { Component } from "vue";
import { NavigationItem, NavigationTree, Section } from "@/models/navigation";

// mock libraries
vi.mock("vue-router");

// default stubs
const modules: Record<string, RouteComponent> = {
  a: <Component>{},
  b: <Component>{},
};
const section = new Section("1", "Admin Section", undefined, ["admin"]);
const navigationItems: NavigationItem[] = [
  new NavigationItem("1", "Order", section, [], undefined, undefined, undefined, "a"),
  new NavigationItem("2", "Customers", section, [], undefined, undefined, undefined, "b"),
];
section.items = navigationItems;
const tree = new NavigationTree([section]);

describe("RouteGenerator", () => {
  beforeEach(() => {
    container.reset();
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
