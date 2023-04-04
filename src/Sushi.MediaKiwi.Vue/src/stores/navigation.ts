import { defineStore } from "pinia";
import { useMediakiwiStore } from ".";
import { type IBreadcrumb } from "@/models/breadcrumb/index";
import { type INavigationState } from "@/models/stores";

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
