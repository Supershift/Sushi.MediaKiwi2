import { defineStore } from "pinia";
import type { INavigationItem } from "@/models/navigation";
import { useMediakiwiStore } from ".";
import type ISection from "@/models/section/ISection";
import { IBreadcrumbItem } from "@/models/navigation/IBreadcrumbItem";

type NavigationState = {
  navigationItems: Array<INavigationItem>;
  sectionItems: Array<ISection>;
  breadcrumbItems: Array<IBreadcrumbItem>;
  currentSection: ISection | undefined;
  drawer: boolean;
};

export const useNavigationStore = defineStore({
  id: "navigationStore",
  state: () =>
    ({
      navigationItems: [],
      sectionItems: [],
      breadcrumbItems: [],
      currentSection: {
        id: 0,
        name: "Home",
        sortOrder: 0,
      },
      drawer: true,
    } as NavigationState),
  getters: {
    navigationList: (state: NavigationState) => state.navigationItems,
    sectionList: (state: NavigationState) => state.sectionItems,
    breadcrumbList: (state: NavigationState) => state.breadcrumbItems,
  },
  actions: {
    async getNavigation() {
      // grab the items from the main store/services or mock
      const mediaKiwiStore = useMediakiwiStore();
      const items = mediaKiwiStore.navigationItems;
      const sections = mediaKiwiStore.mediakiwiSections;
      const breadcrumbs = [{
        title: "HomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHome",
        disabled: false, 
        bold: false,
        path: "/Home",
      }] as Array<IBreadcrumbItem>;

      // set breadcrumbs
      if (breadcrumbs && breadcrumbs.length) {
        this.setBreadCrumbs(true); 
        this.breadcrumbItems = breadcrumbs;
      }
      // set sections
      if (sections && sections.length) {
        this.sectionItems = sections;
      }
      // set items
      if (items && items.length) {
        this.navigationItems = items.filter((x) => x.sectionId === this.currentSection?.id) ?? [];
      }
    },
    setSectionNavigationItems(id: number) {
      if (id !== null) {
        const items = useMediakiwiStore().mediakiwiNavigationItems.filter((item) => item?.sectionId == id);

        if (items && items.length) {
          this.navigationItems = items;
        }
      }
    },
    setCurrentSection(navigationItem: INavigationItem | undefined): void {
      // Assign the right section with the given name
      if (navigationItem && navigationItem.path && this.sectionItems) {
        const name = navigationItem.path.split("/")[1] ?? "Home";
        this.currentSection = this.sectionItems.find((x) => x.name == name);
      }
      // Repopulate the navigationItems with the correct section assigned items
      this.setSectionNavigationItems(this.currentSection?.id ?? 0);

      //Since this is a section Click we know that the breadcrumbs are empty 
      this.setBreadCrumbs(true)
    },
    setBreadCrumbs(reset: boolean){
      if (this.navigationItems.length && !reset) {
        this.breadcrumbItems = [];
        window.location.pathname.split("/").forEach((r) => {
          if (r !== undefined && r !== null && r !== "") {
            this.breadcrumbItems.push({title: r, disabled: false, bold: false, path: "/"+ r });
          }
        });
      } else {
        this.breadcrumbItems = [];
      }
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
});
