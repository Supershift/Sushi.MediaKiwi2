import { View, ISection, INavigationItem } from "@supershift/mediakiwi-vue";

export const navigationItems = <INavigationItem[]>[
  {
    id: 0,
    name: "Home",
    viewId: 0,
    sectionId: 0,
    parentNavigationItemId: null,
  },
  {
    id: 1,
    name: "Hotels",
    viewId: 1,
    sectionId: 1,
    parentNavigationItemId: null,
  },
  {
    id: 11,
    name: "Hotel-sub-1",
    viewId: 3,
    sectionId: 1,
    parentNavigationItemId: 1,
  },
  {
    id: 111,
    name: "Hotel-deeper-sub-1",
    viewId: 3,
    sectionId: 1,
    parentNavigationItemId: 11,
  },
  {
    id: 2,
    name: "Customers",
    viewId: 2,
    sectionId: 1,
    parentNavigationItemId: null,
    icon: "$accountCircle",
  },
  {
    id: 21,
    name: "Category",
    viewId: null,
    sectionId: 1,
    parentNavigationItemId: 2,
  },
  {
    id: 211,
    name: "Deep-level",
    viewId: 3,
    sectionId: 1,
    parentNavigationItemId: 21,
  },
  {
    id: 3,
    name: "Sample-data-overview",
    viewId: 3,
    sectionId: 1,
    parentNavigationItemId: null,
  },
  {
    id: 31,
    name: "Sample-data-edit",
    viewId: 4,
    sectionId: 1,
    parentNavigationItemId: 3,
    isDynamicRoute: true,
    dynamicRouteParamaterName: "sampleDataId",
  },
  {
    id: 311,
    name: "Sample-deep-data-edit",
    viewId: 5,
    sectionId: 1,
    parentNavigationItemId: 31,
    isDynamicRoute: true,
    dynamicRouteParamaterName: "deepDataId",
  },
];

export const views = <View[]>[
  { id: 0, componentKey: "./views/Home.vue", sectionId: 0, name: "Home", externalId: "Home" },
  { id: 1, componentKey: "./views/Screen1.vue", sectionId: 1, name: "Screen 1", externalId: "Screen 1" },
  { id: 2, componentKey: "./views/Hotels.vue", sectionId: 1, name: "Screen 2", externalId: "Screen 2" },
  { id: 3, componentKey: "./views/SampleData.vue", sectionId: 1, name: "Sample data overview", externalId: "Sample data overview" },
  { id: 4, componentKey: "./views/SampleDataEdit.vue", sectionId: 1, name: "SampleDataEdit", externalId: "SampleDataEdit" },
  { id: 5, componentKey: "./views/SampleDeepDataEdit.vue", sectionId: 1, name: "SampleDeepDataEdit", externalId: "SampleDeepDataEdit" },
];

const sections = Array<ISection>();
sections.push({
  id: 0,
  name: "Home",
  sortOrder: 0,
  icon: "mdi-home",
});
sections.push({
  id: 1,
  name: "Hotels",
  sortOrder: 1,
  icon: "mdi-office-building",
});
sections.push({
  id: 2,
  name: "Users",
  sortOrder: 2,
  icon: "mdi-account",
});
sections.push({
  id: 999,
  name: "Admin",
  sortOrder: 1,
  icon: "mdi-security",
});
export { sections };
