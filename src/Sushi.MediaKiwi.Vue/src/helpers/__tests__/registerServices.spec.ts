import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { container } from "tsyringe";
import { registerServices } from "../registerServices";
import { NavigationConnector, INavigationConnector } from "@/services";
import { IMediakiwiServiceRegistrations } from "@/models/options/IMediakiwiVueOptions";

class MockedConnector implements INavigationConnector {}

describe("registerServices", () => {
  beforeEach(() => {
    container.reset();
  });
  it("Should register default from undefined registrations holder", () => {
    registerServices(container, undefined);

    var connector = container.resolve("INavigationConnector");

    expect(connector).toBeInstanceOf(NavigationConnector);
  });
  it("Should register default from undefined registration", () => {
    const registrations = <IMediakiwiServiceRegistrations>{};
    registerServices(container, registrations);

    var connector = container.resolve("INavigationConnector");

    expect(connector).toBeInstanceOf(NavigationConnector);
  });
  it("Should register class constructor", () => {
    const registrations = <IMediakiwiServiceRegistrations>{
      navigationConnector: MockedConnector,
    };
    registerServices(container, registrations);

    var connector = container.resolve("INavigationConnector");

    expect(connector).toBeInstanceOf(MockedConnector);
  });
});
