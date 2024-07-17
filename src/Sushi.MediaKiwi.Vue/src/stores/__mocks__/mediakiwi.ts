import { ListResult, NavigationItem, Paging, Role, Section, Sorting, View } from "@/models";
import { INavigationConnector, ISectionConnector, IViewConnector } from "@/services";
import { IRoleConnector } from "@/services/IRoleConnector";
import { AxiosResponse } from "axios";

export const expectedResultNavItems = <AxiosResponse>{
  data: <ListResult<NavigationItem>>{
    result: [<NavigationItem>{ id: "1", name: "test", sectionId: "1" }],
    totalCount: 1,
    pageCount: 1,
  },
};
export const expectedChangeNavItems = <AxiosResponse>{
  data: <ListResult<NavigationItem>>{
    result: [
      <NavigationItem>{ id: "2", name: "Intl cars", sectionId: "99", path: "non-euro", viewId: "4" },
      <NavigationItem>{ id: "3", name: "bentley", sectionId: "99", parentNavigationItemId: "2", viewId: "1" },
      <NavigationItem>{ id: "4", name: "audi", sectionId: "99", parentNavigationItemId: "2", viewId: "0" },
      <NavigationItem>{ id: "5", name: "Hayabuza", sectionId: "2", viewId: "3" },
      <NavigationItem>{ id: "6", name: "Dutch cars", sectionId: "1", viewId: "2" },
      <NavigationItem>{ id: "7", name: "spyker", sectionId: "1", parentNavigationItemId: "6", viewId: "1" },
    ],
    totalCount: 6,
    pageCount: 2,
  },
};

export const expectedResultSections = <AxiosResponse>{
  data: <ListResult<Section>>{
    result: [<Section>{ id: "1", name: "test" }],
    totalCount: 1,
    pageCount: 1,
  },
};
export const expectedChangeSections = <AxiosResponse>{
  data: <ListResult<Section>>{
    result: [
      <Section>{ id: "2", name: "Cars" },
      <Section>{ id: "3", name: "Bikes" },
      <Section>{ id: "4", name: "Settings" },
      <Section>{ id: "99", name: "External" },
    ],
    totalCount: 1,
    pageCount: 1,
  },
};

export const expectedResultViews = <AxiosResponse>{
  data: <ListResult<View>>{
    result: [<View>{ id: "1", name: "test" }],
    totalCount: 1,
    pageCount: 1,
  },
};
export const expectedChangeViews = <AxiosResponse>{
  data: <ListResult<View>>{
    result: [
      <View>{ id: "0", name: "Dutch Cars Overview", componentKey: "./views/CarsOverview.vue" },
      <View>{ id: "1", name: "Car Details", componentKey: "./views/CarDetails.vue", parameterName: "carId" },
      <View>{ id: "2", name: "Bikes Overview", componentKey: "./views/BikesOverview.vue" },
      <View>{ id: "3", name: "Bike Details", componentKey: "./views/BikeDetails.vue", parameterName: "bikeId" },
      <View>{ id: "4", name: "International Cars Overview", componentKey: "./views/DutchCarsOverview.vue" },
      <View>{ id: "99", name: "Settings", componentKey: "./views/Settings" },
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
    result: [
      <Role>{ id: "5", name: "User" },
      <Role>{ id: "10", name: "SuperUser" },
      <Role>{ id: "7", name: "Moderator" },
      <Role>{ id: "99", name: "Admin" }
    ],
    totalCount: 4,
    pageCount: 1,
  },
};
export class MockedNavigationConnector implements INavigationConnector {
  GetNavigationItem(id: string): Promise<NavigationItem> {
    throw new Error("Method not implemented.");
  }
  CreateNavigationItem(item: NavigationItem): Promise<NavigationItem> {
    throw new Error("Method not implemented.");
  }
  UpdateNavigationItem(item: NavigationItem): Promise<NavigationItem> {
    throw new Error("Method not implemented.");
  }
  DeleteNavigationItem(id: string): Promise<AxiosResponse<any, any>> {
    throw new Error("Method not implemented.");
  }
  GetNavigationItems(
    _sectionId?: string | undefined,
    _paging?: Paging | undefined,
    _sorting?: Sorting<NavigationItem> | undefined
  ): Promise<ListResult<NavigationItem>> {
    return Promise.resolve(expectedResultNavItems.data);
  }
}

export class MockedSectionsConnector implements ISectionConnector {
  GetSections(paging?: Paging): Promise<ListResult<Section>> {
    return Promise.resolve(expectedResultSections.data);
  }
  GetSection(id: string): Promise<Section | undefined> {
    throw new Error("Method not implemented.");
  }
  CreateSection(id: string, request: Section): Promise<Section> {
    throw new Error("Method not implemented.");
  }
  UpdateSection(id: string, request: Section): Promise<Section> {
    throw new Error("Method not implemented.");
  }
  DeleteSection(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export class MockedViewsConnector implements IViewConnector {
  GetViews(paging?: Paging): Promise<ListResult<Section>> {
    return Promise.resolve(expectedResultViews.data);
  }
  GetView(id: string): Promise<Section | undefined> {
    throw new Error("Method not implemented.");
  }
  CreateView(id: string, request: Section): Promise<Section> {
    throw new Error("Method not implemented.");
  }
  UpdateView(id: string, request: Section): Promise<Section> {
    throw new Error("Method not implemented.");
  }
  DeleteView(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export class MockedRolesConnector implements IRoleConnector {
  GetRoles(): Promise<ListResult<Section>> {
    return Promise.resolve(expectedResultRoles.data);
  }
  GetRole(id: string): Promise<Section | undefined> {
    throw new Error("Method not implemented.");
  }
  CreateRole(id: string, request: Section): Promise<Section> {
    throw new Error("Method not implemented.");
  }
  UpdateRole(id: string, request: Section): Promise<Section> {
    throw new Error("Method not implemented.");
  }
  DeleteRole(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}