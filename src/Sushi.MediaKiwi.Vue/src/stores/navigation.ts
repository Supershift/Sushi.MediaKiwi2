import { defineStore } from "pinia";
import { useMediakiwiStore } from ".";
import { type IBreadcrumb } from "@/models/breadcrumb/index";
import { type INavigationState } from "@/models/stores";
import { getNavigationItemChildren } from "@/helpers";


export const useNavigationStore = defineStore({
  id: "navigationStore",
  state: () =>
    ({
      navigationItems: [],
      sectionItems: [],
      breadcrumbItems: [],
      drawer: true,
    } as INavigationState),
  getters: {
    navigationList: (state: INavigationState) => state.navigationItems,
    sectionList: (state: INavigationState) => state.sectionItems,
    breadcrumbList: (state: INavigationState) => state.breadcrumbItems,
  },
  actions: {
    getNavigation() {
      // grab the items from the main store/services or mock
      const mediaKiwiStore = useMediakiwiStore();
      const items = mediaKiwiStore.navigationItems;
      const sections = mediaKiwiStore.mediakiwiSections;
      const breadcrumbs = [] as Array<IBreadcrumb>;

      // set breadcrumbs
      if (breadcrumbs && breadcrumbs.length) {
        this.setBreadCrumbs(breadcrumbs);
      }
      // set sections
      if (sections && sections.length) {
        this.sectionItems = sections;
      }
      // navigationItems is also being repopulated for us on every click (fetches it from the medikiwiStore)
      if (items && items.length) {
        this.navigationItems = items;
      }
    },
    setSectionNavigationItems(name: string) {
      if (name) {
        // check if this is a valid Section and assign the right sub-items to that section
        const currentSectionId = useMediakiwiStore().mediakiwiSections.find((x) => x.name === name)?.id;
        if (currentSectionId) {
          //assign the right navigation items to the section
          const items = useMediakiwiStore().mediakiwiNavigationItems.filter((x) => x.sectionId === currentSectionId);

          if (items && items.length) {
            this.navigationItems = items;
          }
        } else {
          // not a section, so assign somewhere to land fetch the right items
          const currentNavigationItem = useMediakiwiStore().mediakiwiNavigationItems.find((x) => x.name === name);
          const items = getNavigationItemChildren(currentNavigationItem, useMediakiwiStore().mediakiwiNavigationItems, true);
          this.navigationItems = items;
          console.warn("No Section!");
        }
      } else {
        // there is no section selected so lets just place navigation items to empty for now
        this.navigationItems = [];
      }
    },
    setBreadCrumbs(breadcrumbs: Array<IBreadcrumb>) {
      if (breadcrumbs.length) {
        this.breadcrumbItems = breadcrumbs;
      }
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
});
