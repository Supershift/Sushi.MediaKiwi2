import { View, Section, NavigationItem } from "@/models";

export const navigationItems = <NavigationItem[]>[
  {
    id: 0,
    name: "Home",
    viewId: "Home",
    sectionId: 0,
    parentNavigationItemId: undefined,
    path: "/Home",
  },
  {
    id: 1,
    name: "Hotels",
    viewId: "Hotels",
    sectionId: 1,
    parentNavigationItemId: undefined,
    path: "/Hotels",
  },
  {
    id: 11,
    name: "Hotel-sub-1",
    viewId: "Hotels",
    sectionId: 1,
    parentNavigationItemId: 1,
    path: "/Hotel",
  },
  {
    id: 111,
    name: "Hotel-deeper-sub-1",
    viewId: 3,
    sectionId: 1,
    parentNavigationItemId: 11,
    path: "/HotelSub",
  },
  {
    id: 2,
    name: "Customers",
    viewId: 2,
    sectionId: 1,
    parentNavigationItemId: undefined,
    icon: "$accountCircle",
    path: "/Customers",
  },
  {
    id: 21,
    name: "Category",
    viewId: null,
    sectionId: 1,
    parentNavigationItemId: 2,
    path: "/Category",
  },
  {
    id: 211,
    name: "Deep-level",
    viewId: 3,
    sectionId: 1,
    parentNavigationItemId: 21,
    path: "/Deep-Level",
  },
  {
    id: 3,
    name: "Sample-data-overview",
    viewId: 3,
    sectionId: 1,
    parentNavigationItemId: undefined,
    path: "/Sample-data-overview",
  },
  {
    id: 31,
    name: "Sample-data-edit",
    viewId: 4,
    sectionId: 1,
    parentNavigationItemId: 3,
    path: "/Sample-data-edit",
  },
  {
    id: 311,
    name: "Sample-deep-data-edit",
    viewId: 5,
    sectionId: 1,
    parentNavigationItemId: 31,
    path: "/Sample-deep-data-edit",
  },
];

export const views = <View[]>[
  { id: "0", componentKey: "./views/Home.vue", sectionId: 0, name: "Home" },
  { id: "1", componentKey: "./views/Screen1.vue", sectionId: 1, name: "Screen 1" },
  { id: "2", componentKey: "./views/Hotels.vue", sectionId: 1, name: "Screen 2" },
  { id: "3", componentKey: "./views/SampleData.vue", sectionId: 1, name: "Sample data overview" },
  { id: "4", componentKey: "./views/SampleDataEdit.vue", sectionId: 1, name: "SampleDataEdit" },
  { id: "5", componentKey: "./views/SampleDeepDataEdit.vue", sectionId: 1, name: "SampleDeepDataEdit" },
];

const sections = Array<Section>();
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
