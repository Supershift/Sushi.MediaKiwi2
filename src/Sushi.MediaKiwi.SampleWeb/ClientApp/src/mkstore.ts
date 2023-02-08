import { reactive } from 'vue'
import type { INavigationItem } from './models/INavigationItem'
import type { IScreen } from './models/IScreen'

// get the navigation items
const navigationItems = <INavigationItem[]>[
  { id: 1, name: "Hotels", screenId: 1, typeId: 3, sectionId: 1, parentNavigationItemId: null },
  { id: 11, name: "Hotel sub 1", screenId: 3, typeId: 3, sectionId: 1, parentNavigationItemId: 1 },
  { id: 111, name: "Hotel deeper sub 1", screenId: 3, typeId: 1, sectionId: 1, parentNavigationItemId: 11 },
  { id: 2, name: "Customers", screenId: 2, typeId: 1, sectionId: 1, parentNavigationItemId: null },
  { id: 21, name: "Category", screenId: null, typeId: 2, sectionId: 1, parentNavigationItemId: 2 },
  { id: 211, name: "Deep level", screenId: 1, typeId: 1, sectionId: 1, parentNavigationItemId: 21 },
  { id: 3, name: "Something else", screenId: 3, typeId: 1, sectionId: 1, parentNavigationItemId: null },
]

// apply path to all navigation items
function getPath(navigationItem: INavigationItem): string {
  // get the full path for this item by recursively going up the tree  
  var parentPath: string = '';
  if (navigationItem.parentNavigationItemId != null) {
    var parent = navigationItems.find((item) => item.id == navigationItem.parentNavigationItemId);
    if (parent !== undefined) {
      parentPath = getPath(parent)
    }
  }
  return parentPath + `/${navigationItem.name}`;
}
navigationItems.forEach((item) => { item.path = getPath(item)});

const screens = <IScreen[]>[
  { id: 1, componentFileName: 'Screen1.vue', sectionId: 1, name: 'Screen 1' },
  { id: 2, componentFileName: 'Screen2.vue', sectionId: 2, name: 'Screen 2' },
  { id: 3, componentFileName: 'Screen3.vue', sectionId: 3, name: 'Screen 3' },
]

class MkStore {
  currentScreenId: number = 0;
  navigationItems: INavigationItem[] = [];
  screens: IScreen[] = [];
  getCurrentScreen(): IScreen | undefined {
    let result = screens.find(x => x.id == this.currentScreenId);
    return result;
  }
}

const store = reactive<MkStore>(new MkStore());
store.navigationItems = navigationItems;
store.screens = screens;
store.currentScreenId = screens[0].id;

export { store };