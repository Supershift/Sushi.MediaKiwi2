import { defineStore } from "pinia";
import type { INavigationItem } from "@/models/navigation";
import { MediaKiwiState, useMediakiwiStore } from ".";
import type ISection from "@/models/section/ISection";

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
    async GET_NAVIGATION() {
      // grab the items from the main store/services or mock 
      const mediaKiwiStore = useMediakiwiStore();
      const items = mediaKiwiStore.navigationItems;
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
    SET_SECTION_NAVIGATION_ITEMS(id: number) {
      console.log("current section nav items: "+ this.navigationItems.length);
      console.log("id: "+ id);
      if (id !== null) {
        const items = this.navigationItems.filter((item) => item?.sectionId == id);
        console.log("set section nav items: "+ items);
        
        if (items && items.length > 0) {
          this.navigationItems = items;
          console.log("new section nav items: "+ this.navigationItems);
        }
      }
    },
    SET_CURRENT_SECTION(name: string): void {
      // Assign the right section with the given name
      if (name && this.sectionItems) {
        this.currentSection = this.sectionItems.find((x) => x.name == name);
      }
      // Repopulate the navigationItems wit hthee correct section assigned items
      this.SET_SECTION_NAVIGATION_ITEMS(this.currentSection?.id ?? 0);      
      
    },
    NAVIGATE_TO(path: string, isSection: boolean) {
      // Since we are injecting the router via the sotre it is already up and running when we initiate
      if (path && this.router) {
        // if it's the section, then we reset the navigation
        if (isSection) {
          this.SET_CURRENT_SECTION(path);
          path = "/" + path;
        }
        // called to send user to target screen
        this.router.push(path);
      }
    },
  },
});
