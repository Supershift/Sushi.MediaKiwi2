import "reflect-metadata";
import { describe, it, expect, beforeEach } from "vitest";
import { container } from "tsyringe";
import { registerServices } from "../registerServices";
import { INavigationConnector, IViewConnector, ISectionConnector } from "../../services";
import { NavigationConnector, ViewConnector, SectionConnector } from "../../services";
import { IMediakiwiServiceRegistrations } from "../../models/options";
import { Paging, ListResult, NavigationItemDto, Sorting, ViewDto, SectionDto } from "@/models";
import { AxiosResponse } from "axios";

class MockedNavigationConnector implements INavigationConnector {
  GetNavigationItem(id: string): Promise<NavigationItemDto> {
    throw new Error("Method not implemented.");
  }
  CreateNavigationItem(item: NavigationItemDto): Promise<NavigationItemDto> {
    throw new Error("Method not implemented.");
  }
  UpdateNavigationItem(item: NavigationItemDto): Promise<NavigationItemDto> {
    throw new Error("Method not implemented.");
  }
  DeleteNavigationItem(id: string): Promise<AxiosResponse<any, any>> {
    throw new Error("Method not implemented.");
  }
  GetNavigationItems(
    _sectionId?: string | undefined,
    _paging?: Paging | undefined,
    _sorting?: Sorting<NavigationItemDto> | undefined
  ): Promise<ListResult<NavigationItemDto>> {
    throw new Error("Method not implemented.");
  }
}
class MockedViewConnector implements IViewConnector {
  CreateView(_id: string, _request: ViewDto): Promise<ViewDto> {
    throw new Error("Method not implemented.");
  }
  DeleteView(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  GetViews(_paging?: Paging, _sorting?: Sorting): Promise<ListResult<ViewDto>> {
    throw new Error("Method not implemented.");
  }
  GetView(_id: string): Promise<ViewDto | undefined> {
    throw new Error("Method not implemented.");
  }
  UpdateView(_id: string, _request: ViewDto): Promise<ViewDto> {
    throw new Error("Method not implemented.");
  }
}
class MockedSectionConnector implements ISectionConnector {
  CreateSection(_id: string, _request: SectionDto): Promise<SectionDto> {
    throw new Error("Method not implemented.");
  }
  DeleteSection(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  GetSections(_paging?: Paging | undefined): Promise<ListResult<SectionDto>> {
    throw new Error("Method not implemented.");
  }
  GetSection(_id: string): Promise<SectionDto | undefined> {
    throw new Error("Method not implemented.");
  }
  UpdateSection(_id: string, _request: SectionDto): Promise<SectionDto> {
    throw new Error("Method not implemented.");
  }
}

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
