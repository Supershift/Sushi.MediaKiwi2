import { reactive } from "vue";
import type { INavigationItem } from "@/models/navigation";
import type { IScreen } from "@/models/screen/IScreen";

// {@depricated} soon
// get the navigation items
const navigationItems = <INavigationItem[]><unknown>[
{
id: 1,
name: "Hotels",
screenId: 1,
typeId: 3,
sectionId: 1,
parentNavigationItemId: null,
},
{
id: 11,
name: "Hotel-sub-1",
screenId: 3,
typeId: 3,
sectionId: 1,
parentNavigationItemId: 1,
},
{
id: 111,
name: "Hotel-deeper-sub-1",
screenId: 3,
typeId: 1,
sectionId: 1,
parentNavigationItemId: 11,
},
{
id: 2,
name: "Customers",
screenId: 2,
typeId: 1,
sectionId: 1,
parentNavigationItemId: null,
},
{
id: 21,
name: "Category",
screenId: null,
typeId: 2,
sectionId: 1,
parentNavigationItemId: 2,
},
{
id: 211,
name: "Deep-level",
screenId: 3,
typeId: 1,
sectionId: 1,
parentNavigationItemId: 21,
},
{
id: 3,
name: "Sample-data-overview",
screenId: 2,
typeId: 1,
sectionId: 1,
parentNavigationItemId: null,
},
{
id: 31,
name: "Sample-data-edit",
screenId: 4,
typeId: 1,
sectionId: 1,
parentNavigationItemId: 3,
isDynamicRoute: true,
dynamicRouteParamaterName: 'sampleDataId'
},
{
id: 311,
name: "Sample-deep-data-edit",
screenId: 5,
typeId: 1,
sectionId: 1,
parentNavigationItemId: 31,
isDynamicRoute: true,
dynamicRouteParamaterName: 'deepDataId'
},
];

// determines the path for a navigation item by recursively calling itself
function getPath(navigationItem: INavigationItem): string {
  // get the full path for this item by recursively going up the tree
  let parentPath: string = "";
  if (navigationItem.parentNavigationItemId != null) {
    const parent = navigationItems.find((item) => item.id == navigationItem.parentNavigationItemId);
    if (parent !== undefined) {
      parentPath = getPath(parent);
    }
  }

  // if it is a dynamic route to an item instance, add :id to the path
  if (navigationItem.isDynamicRoute) {
    return parentPath + `/${navigationItem.name}/:${navigationItem.dynamicRouteParamaterName}`;
  }
  else {
    return parentPath + `/${navigationItem.name}`;
  }
}

// determine path for all navigation items
navigationItems.forEach((item) => {
  item.path = getPath(item);
});

const screens = <IScreen[]>[
  { id: 1, componentFileName: 'Screen1.vue', sectionId: 1, name: "Screen 1" },
  { id: 2, componentFileName: "Screen2.vue", sectionId: 1, name: "Screen 2" },
  { id: 3, componentFileName: "SampleData.vue", sectionId: 1, name: "Sample data overview" },
  { id: 4, componentFileName: "SampleDataEdit.vue", sectionId: 1, name: "SampleDataEdit" },
  { id: 5, componentFileName: "SampleDeepDataEdit.vue", sectionId: 1, name: "SampleDeepDataEdit" },
];

class MkStore {
  navigationItems: INavigationItem[] = [];
  screens: IScreen[] = [];
}

const store = reactive<MkStore>(new MkStore());
store.navigationItems = navigationItems;
store.screens = screens;

export { store };
