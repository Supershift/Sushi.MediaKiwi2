import { defineStore } from "pinia";
import type { NavigationItem, Section, View } from "@/models/api";
import type { INavigationConnector, IViewConnector, ISectionConnector } from "@/services";
import type ListResult from "@/models/api/ListResult";
import { container } from "tsyringe";

export interface MediaKiwiState {
  navigationItems: Array<NavigationItem>;
  views: Array<View>;
  sections: Array<Section>;
  isLocal: boolean;
}

export const useMediakiwiStore = defineStore({
  id: "mediaKiwiStore",
  state: () =>
    ({
      navigationItems: [],
      views: [],
      sections: [],
      isLocal: true,
    } as MediaKiwiState),
  getters: {
    mediakiwiViews: (state: MediaKiwiState) => state.views,
    mediakiwiSections: (state: MediaKiwiState) => state.sections,
    mediakiwiNavigationItems: (state: MediaKiwiState) => state.navigationItems,
  },
  actions: {
    async init() {
      // load new data from API (positioning matters => section, screens, navigationItems)
      await this.getSections();
      await this.getViews();
      await this.getNavigationItems();
    },
    async getNavigationItems() {
      // get instance of INavigationConnector
      const connector = container.resolve<INavigationConnector>("INavigationConnector");
      // get nav items and store them
      const navigationItems = await connector.GetNavigationItems();
      this.setNavigationItems(navigationItems);
    },
    async getViews() {
      const connector = container.resolve<IViewConnector>("IViewConnector");
      const views = await connector.GetViews();
      this.setViews(views);
    },
    async getSections() {
      const connector = container.resolve<ISectionConnector>("ISectionConnector");
      const sections = await connector.GetSections();
      this.setSections(sections);
    },
    setNavigationItems(payload: ListResult<NavigationItem>) {
      if (payload) {
        this.navigationItems = payload.result;
        this.navigationItems.forEach((item) => {
          // since the sections doesnt have a path we use a "/"
          const sectionName = this.sections.find((x) => x.id === item.sectionId)?.name;
          item.path = "/" + sectionName + this.getParentPath(item);
        });
      }
    },
    setViews(payload: ListResult<View>) {
      if (payload) {
        this.views = payload.result;
      }
    },
    setSections(payload: ListResult<Section>) {
      if (payload) {
        this.sections = payload.result;
      }
    },
    getParentPath(payload: NavigationItem): string {
      // get the full path for this item by recursively going up the tree
      let parentPath = "";
      if (payload.parentNavigationItemId != null) {
        const parent = this.navigationItems.find((item: NavigationItem) => item.id == payload.parentNavigationItemId);
        if (parent !== undefined) {
          parentPath = this.getParentPath(parent);
        }
      }
      return parentPath + `/${payload.name}`;
    },
  },
});
