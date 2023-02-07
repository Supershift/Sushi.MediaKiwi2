import { reactive } from 'vue'
import { INavigationItem  } from './models/INavigationItem'
import { IScreen } from './models/IScreen'

const navigationItems = <INavigationItem[]>[
  { id: 1, name: "Hotels", screenId: 1, typeId: 1, sectionId : 1, parentNavigationItemId: null },
  { id: 2, name: "Customers", screenId: 2, typeId: 1, sectionId : 1, parentNavigationItemId: null },
  { id: 3, name: "Something else", screenId: 3, typeId: 1, sectionId : 1, parentNavigationItemId: null },
] 

const screens = <IScreen[]>[
  { id: 1, componentFileName: 'Screen1.vue', sectionId: 1, name: 'Screen 1' },
  { id: 2, componentFileName: 'Screen2.vue', sectionId: 2, name: 'Screen 2' },
  { id: 3, componentFileName: 'Screen3.vue', sectionId: 3, name: 'Screen 3' },
]

class MkStore 
{
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