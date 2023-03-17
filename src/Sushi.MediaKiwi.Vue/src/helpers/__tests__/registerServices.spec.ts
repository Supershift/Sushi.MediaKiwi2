import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { container } from "tsyringe";
import { registerServices } from "../registerServices";
import { INavigationConnector, IScreenConnector, ISectionConnector } from "../../services";
import { NavigationConnector, ScreenConnector, SectionConnector } from "../../services";
import { IMediakiwiServiceRegistrations } from "../../models/options";
import { RouterHelper } from "../../router/routerHelper";

class MockedNavigationConnector implements INavigationConnector {}
class MockedScreenConnector implements IScreenConnector {}
class MockedSectionConnector implements ISectionConnector {}

describe("registerServices", () => {
  beforeEach(() => {
    container.reset();
  });
  it("Should register all defaults from undefined registrations holder", () => {
    registerServices(container, undefined);

    var navConnector = container.resolve("INavigationConnector");
    var screenConnector = container.resolve("IScreenConnector");
    var sectionConnector = container.resolve("ISectionConnector");

    expect(navConnector).toBeInstanceOf(NavigationConnector);
    expect(screenConnector).toBeInstanceOf(ScreenConnector);
    expect(sectionConnector).toBeInstanceOf(SectionConnector);
  });
  it("Should register default from undefined registration", () => {
    const registrations = <IMediakiwiServiceRegistrations>{};
    registerServices(container, registrations);

    var connector = container.resolve("INavigationConnector");

    expect(connector).toBeInstanceOf(NavigationConnector);
  });
  it("Should register class constructor", () => {
    const registrations = <IMediakiwiServiceRegistrations>{
      navigationConnector: MockedNavigationConnector,
      sectionConnector: MockedSectionConnector,
      screenConnector: MockedScreenConnector,
    };
    registerServices(container, registrations);

    var navConnector = container.resolve("INavigationConnector");
    var screenConnector = container.resolve("IScreenConnector");
    var sectionConnector = container.resolve("ISectionConnector");

    expect(navConnector).toBeInstanceOf(MockedNavigationConnector);
    expect(screenConnector).toBeInstanceOf(MockedScreenConnector);
    expect(sectionConnector).toBeInstanceOf(MockedSectionConnector);
  });
  it("Should register helpers", () => {
    registerServices(container, undefined);

    var routerHelper = container.resolve("RouterHelper");

    expect(routerHelper).toBeInstanceOf(RouterHelper);
  });
});
