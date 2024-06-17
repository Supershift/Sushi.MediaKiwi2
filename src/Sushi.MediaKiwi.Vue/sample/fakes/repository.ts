import { View, Section, NavigationItem } from "@/models";

export const navigationItems = <NavigationItem[]>[
  {
    id: "Home",
    name: "Home",
    viewId: "Home",
    sectionId: "Home",
    parentNavigationItemId: undefined,
    path: "/Home",
  },
  {
    id: "Hotels",
    name: "Hotels",
    viewId: "Hotels",
    sectionId: "Hotels",
    parentNavigationItemId: undefined,
    path: "/Hotels",
  },
  {
    id: "Hotel-sub-1",
    name: "Hotel sub 1",
    viewId: "Hotels",
    sectionId: "Hotels",
    parentNavigationItemId: 1,
    path: "/Hotel",
  },
  {
    id: "Hotel-deeper-sub-1",
    name: "Hotel deeper sub 1",
    viewId: 3,
    sectionId: "Hotels",
    parentNavigationItemId: 11,
    path: "/HotelSub",
  },
  {
    id: "Customers",
    name: "Customers",
    viewId: 2,
    sectionId: "Hotels",
    parentNavigationItemId: undefined,
    icon: "$accountCircle",
    path: "/Customers",
  },
  {
    id: "Category",
    name: "Category",
    viewId: null,
    sectionId: "Hotels",
    parentNavigationItemId: 2,
    path: "/Category",
  },
  {
    id: "Deep-level",
    name: "Deep level",
    viewId: 3,
    sectionId: "Hotels",
    parentNavigationItemId: 21,
    path: "/Deep-Level",
  },
  {
    id: "Sample-data-overview",
    name: "Sample-data-overview",
    viewId: 3,
    sectionId: "Hotels",
    parentNavigationItemId: undefined,
    path: "/Sample-data-overview",
  },
  {
    id: "Sample-data-edit",
    name: "Sample-data-edit",
    viewId: 4,
    sectionId: "Hotels",
    parentNavigationItemId: 3,
    path: "/Sample-data-edit",
  },
  {
    id: "Sample-deep-data-edit",
    name: "Sample-deep-data-edit",
    viewId: 5,
    sectionId: "Hotels",
    parentNavigationItemId: 31,
    path: "/Sample-deep-data-edit",
  },
];

export const views = <View[]>[
  { id: "0", componentKey: "./views/Home.vue", name: "Home" },
  { id: "1", componentKey: "./views/Screen1.vue", name: "Screen 1" },
  { id: "2", componentKey: "./views/Hotels.vue", name: "Screen 2" },
  { id: "3", componentKey: "./views/SampleData.vue", name: "Sample data overview" },
  { id: "4", componentKey: "./views/SampleDataEdit.vue", name: "SampleDataEdit" },
  { id: "5", componentKey: "./views/SampleDeepDataEdit.vue", name: "SampleDeepDataEdit" },
];

const sections = Array<Section>();
sections.push({
  id: "Home",
  name: "Home",
  sortOrder: 0,
  icon: "mdi-home",
});
sections.push({
  id: "Hotels",
  name: "Hotels",
  sortOrder: 1,
  icon: "mdi-office-building",
});
sections.push({
  id: "Users",
  name: "Users",
  sortOrder: 2,
  icon: "mdi-account",
});
sections.push({
  id: "Admin",
  name: "Admin",
  sortOrder: 1,
  icon: "mdi-security",
});
export { sections };
