import "reflect-metadata";
import { describe, it, expect, beforeEach } from "vitest";
import { container } from "tsyringe";
import { registerServices } from "../registerServices";
import { INavigationConnector, IViewConnector, ISectionConnector } from "../../services";
import { NavigationConnector, ViewConnector, SectionConnector } from "../../services";
import { IMediakiwiServiceRegistrations } from "../../models/options";

class MockedNavigationConnector implements INavigationConnector {}
class MockedViewConnector implements IViewConnector {}
class MockedSectionConnector implements ISectionConnector {}

describe("registerServices", () => {
  beforeEach(() => {
    container.reset();

    // register axios instance
    container.register("MediakiwiAxiosInstance", { useValue: {} });
  });
  it("Should register all defaults from undefined registrations holder", () => {
    registerServices(container, undefined);

    var navConnector = container.resolve("INavigationConnector");
    var viewConnector = container.resolve("IViewConnector");
    var sectionConnector = container.resolve("ISectionConnector");

    expect(navConnector).toBeInstanceOf(NavigationConnector);
    expect(viewConnector).toBeInstanceOf(ViewConnector);
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
      viewConnector: MockedViewConnector,
    };
    registerServices(container, registrations);

    var navConnector = container.resolve("INavigationConnector");
    var viewConnector = container.resolve("IViewConnector");
    var sectionConnector = container.resolve("ISectionConnector");

    expect(navConnector).toBeInstanceOf(MockedNavigationConnector);
    expect(viewConnector).toBeInstanceOf(MockedViewConnector);
    expect(sectionConnector).toBeInstanceOf(MockedSectionConnector);
  });
  it("Should register helpers", () => {
    registerServices(container, undefined);

    var isRegistered = container.isRegistered("RouterManager");

    expect(isRegistered);
  });
});
