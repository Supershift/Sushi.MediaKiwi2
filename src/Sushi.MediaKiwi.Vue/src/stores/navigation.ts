import { defineStore } from "pinia";
import type { INavigationItem } from "@/models/navigation";
import { useMediakiwiStore } from ".";
import type ISection from "@/models/section/ISection";
import { useRouter } from "../router/index";

type NavigationState = {
  navigationItems: Array<INavigationItem>;
  sectionItems: Array<ISection>;
  currentSection: ISection | undefined;
};

export const useNavigationStore = defineStore({
  id: "navigationStore",
  state: () =>
    ({
      navigationItems: [],
      sectionItems: [],
      currentSection: {
        id: 0,
        name: "Home",
        sortOrder: 0,
      },
    } as NavigationState),
  getters: {
    navigationList: (state: NavigationState) => state.navigationItems,
    sectionList: (state: NavigationState) => state.sectionItems,
  },
  actions: {
    async GET_NAVIGATION(){
      // grab the items from the main store
      const mediaKiwiStore = useMediakiwiStore();
      const items = mediaKiwiStore.mediakiwiNavigationItems;
      const sections = mediaKiwiStore.mediakiwiSections;

      // set sections
      if (sections && sections.length > 0) {
          this.sectionItems = sections;
      }
      // set items
      if (items && items.length > 0) {                    
          this.navigationItems = items.filter((x) => x.sectionId === this.currentSection?.id) ?? [];
      }
  },
  GET_SECTION_NAVIGATION_ITEMS(id: number): Array<INavigationItem>{
      console.log(this.navigationItems.filter((item) => item?.parentNavigationItemId == id));
      
      if (id) {
          return this.navigationItems.filter((item) => item?.sectionId == id ) ?? [];
      }
      return [];
  },
  SET_CURRENT_SECTION( name: string): void{
      console.log(name, this.sectionItems, this.navigationItems);              
      if (name && this.sectionItems) {
          this.currentSection = this.sectionItems.find((x) => x.name == name);
      }
      console.log(this.currentSection?.id);
      
      const items = this.GET_SECTION_NAVIGATION_ITEMS(this.currentSection?.id ?? 1);
      if (items && items.length > 0) {
          this.navigationItems = items
      }
  },
  NAVIGATE_TO(path: string, isSection: boolean){

      const router = useRouter();
      console.log(path, router);

      // hook up router
      if (path && router) {
          // if it's the section, then we reset the navigation
          if (isSection) {
              this.SET_CURRENT_SECTION(path);
              path = "/" + path;
          }
          // called to send user to target screen
          router.push(path);
      }                
  },
  },
});
