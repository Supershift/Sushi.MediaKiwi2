import { type INavigationConnector, ListResult, INavigationResponse } from "@supershift/mediakiwi-vue";

const navigationItems = <INavigationResponse[]>[
  {
    id: 0,
    name: "Home",
    screenId: 0,
    sectionId: 0,
    parentNavigationItemId: null,
  },
  {
    id: 1,
    name: "Hotels",
    screenId: 1,
    sectionId: 1,
    parentNavigationItemId: null,
  },
  {
    id: 11,
    name: "Hotel-sub-1",
    screenId: 3,
    sectionId: 1,
    parentNavigationItemId: 1,
  },
  {
    id: 111,
    name: "Hotel-deeper-sub-1",
    screenId: 3,
    sectionId: 1,
    parentNavigationItemId: 11,
  },
  {
    id: 2,
    name: "Customers",
    screenId: 2,
    sectionId: 1,
    parentNavigationItemId: null,
  },
  {
    id: 21,
    name: "Category",
    screenId: null,
    sectionId: 1,
    parentNavigationItemId: 2,
  },
  {
    id: 211,
    name: "Deep-level",
    screenId: 3,
    sectionId: 1,
    parentNavigationItemId: 21,
  },
  {
    id: 3,
    name: "Sample-data-overview",
    screenId: 3,
    sectionId: 1,
    parentNavigationItemId: null,
  },
  {
    id: 31,
    name: "Sample-data-edit",
    screenId: 4,
    sectionId: 1,
    parentNavigationItemId: 3,
    isDynamicRoute: true,
    dynamicRouteParamaterName: "sampleDataId",
  },
  {
    id: 311,
    name: "Sample-deep-data-edit",
    screenId: 5,
    sectionId: 1,
    parentNavigationItemId: 31,
    isDynamicRoute: true,
    dynamicRouteParamaterName: "deepDataId",
  },
];

export class NavigationConnector implements INavigationConnector {
  GetNavigationItems(): Promise<ListResult<INavigationResponse>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<INavigationResponse>();
      result.result = navigationItems;
      result.totalCount = navigationItems.length;
      result.pageCount = 0;
      resolve(result);
    });
  }
}
