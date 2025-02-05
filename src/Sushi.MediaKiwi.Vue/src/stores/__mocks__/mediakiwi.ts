import { ListResult, NavigationItemDto, Paging, Role, SectionDto, Sorting, ViewDto } from "@/models";
import { INavigationConnector } from "@/services";
import { AxiosResponse } from "axios";

export const expectedResultNavItems = <AxiosResponse>{
  data: <ListResult<NavigationItemDto>>{
    result: [<NavigationItemDto>{ id: "1", name: "test", sectionId: "1" }],
    totalCount: 1,
    pageCount: 1,
  },
};
export const expectedChangeNavItems = <AxiosResponse>{
  data: <ListResult<NavigationItemDto>>{
    result: [
      <NavigationItemDto>{ id: "2", name: "Intl cars", sectionId: "99", path: "non-euro", viewId: "4" },
      <NavigationItemDto>{ id: "3", name: "bentley", sectionId: "99", parentNavigationItemId: "2", viewId: "1" },
      <NavigationItemDto>{ id: "4", name: "audi", sectionId: "99", parentNavigationItemId: "2", viewId: "0" },
      <NavigationItemDto>{ id: "5", name: "Hayabuza", sectionId: "2", viewId: "3" },
      <NavigationItemDto>{ id: "6", name: "Dutch cars", sectionId: "1", viewId: "2" },
      <NavigationItemDto>{ id: "7", name: "spyker", sectionId: "1", parentNavigationItemId: "6", viewId: "1" },
    ],
    totalCount: 6,
    pageCount: 2,
  },
};

export const expectedResultSections = <AxiosResponse>{
  data: <ListResult<SectionDto>>{
    result: [<SectionDto>{ id: "1", name: "test" }],
    totalCount: 1,
    pageCount: 1,
  },
};
export const expectedChangeSections = <AxiosResponse>{
  data: <ListResult<SectionDto>>{
    result: [
      <SectionDto>{ id: "2", name: "Cars" },
      <SectionDto>{ id: "3", name: "Bikes" },
      <SectionDto>{ id: "4", name: "Settings" },
      <SectionDto>{ id: "99", name: "External" },
    ],
    totalCount: 1,
    pageCount: 1,
  },
};

export const expectedResultViews = <AxiosResponse>{
  data: <ListResult<ViewDto>>{
    result: [<ViewDto>{ id: "1", name: "test" }],
    totalCount: 1,
    pageCount: 1,
  },
};
export const expectedChangeViews = <AxiosResponse>{
  data: <ListResult<ViewDto>>{
    result: [
      <ViewDto>{ id: "0", name: "Dutch Cars Overview", componentKey: "./views/CarsOverview.vue" },
      <ViewDto>{ id: "1", name: "Car Details", componentKey: "./views/CarDetails.vue", parameterName: "carId" },
      <ViewDto>{ id: "2", name: "Bikes Overview", componentKey: "./views/BikesOverview.vue" },
      <ViewDto>{ id: "3", name: "Bike Details", componentKey: "./views/BikeDetails.vue", parameterName: "bikeId" },
      <ViewDto>{ id: "4", name: "International Cars Overview", componentKey: "./views/DutchCarsOverview.vue" },
      <ViewDto>{ id: "99", name: "Settings", componentKey: "./views/Settings" },
    ],
    totalCount: 6,
    pageCount: 1,
  },
};

export const expectedResultRoles = <AxiosResponse>{
  data: <ListResult<Role>>{
    result: [<Role>{ id: "1", name: "test" }],
    totalCount: 1,
    pageCount: 1,
  },
};

export const expectedChangeRoles = <AxiosResponse>{
  data: <ListResult<Role>>{
    result: [<Role>{ id: "5", name: "User" }, <Role>{ id: "10", name: "SuperUser" }, <Role>{ id: "7", name: "Moderator" }, <Role>{ id: "99", name: "Admin" }],
    totalCount: 4,
    pageCount: 1,
  },
};
export class MockedNavigationConnector implements INavigationConnector {
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
    return Promise.resolve(expectedResultNavItems.data);
  }
}
