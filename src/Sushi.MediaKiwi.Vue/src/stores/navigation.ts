import { defineStore } from "pinia";
import type { INavigationItem } from "@/models/navigation";
import { MediaKiwiState, useMediakiwiStore } from ".";
import type ISection from "@/models/section/ISection";
import { useRouter } from "vue-router";

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
      if (id !== null) {
        const items = useMediakiwiStore().mediakiwiNavigationItems.filter((item) => item?.sectionId == id);
        
        if (items && items.length > 0) {
          this.navigationItems = items;
        }
      }
    },
    SET_CURRENT_SECTION(navigationItem: INavigationItem | undefined): void {
      // Assign the right section with the given name
      if (navigationItem && navigationItem.path && this.sectionItems) { 
        const name = navigationItem.path.split("/")[1] ?? "Home";
        this.currentSection = this.sectionItems.find((x) => x.name == name);
      }
      // Repopulate the navigationItems wit hthee correct section assigned items
      this.SET_SECTION_NAVIGATION_ITEMS(this.currentSection?.id ?? 0);      
      
    },
  },
});
