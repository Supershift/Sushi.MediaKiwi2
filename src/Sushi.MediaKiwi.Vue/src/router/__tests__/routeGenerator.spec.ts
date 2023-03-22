import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { container } from "tsyringe";
import { RouteGenerator } from "../routeGenerator";
import { IMediakiwiVueOptions } from "../../models/options";
import { createRouter, RouteComponent, RouterOptions, type RouteRecordRaw, createWebHistory } from "vue-router";
import { Component } from "vue";
import { type INavigationItem, type IScreen } from "../../models";
import { Configuration } from "@azure/msal-browser";

// mock libraries
vi.mock("vue-router");

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
