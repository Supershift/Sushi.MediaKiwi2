import { defineStore } from "pinia";
import type { NavigationItem, Role, Section, View } from "@/models/api";
import type { INavigationConnector, IViewConnector, ISectionConnector } from "@/services";
import type ListResult from "@/models/api/ListResult";
import { container } from "tsyringe";
import { IRoleConnector } from "@/services/IRoleConnector";

export interface MediaKiwiState {
  navigationItems: Array<NavigationItem>;
  views: Array<View>;
  sections: Array<Section>;
  roles: Role[];
  isLocal: boolean;
}

export const useMediakiwiStore = defineStore({
  id: "mediaKiwiStore",
  state: () =>
    ({
      navigationItems: [],
      views: [],
      sections: [],
      roles: [],
      isLocal: true,
    } as MediaKiwiState),
  getters: {
    mediakiwiViews: (state: MediaKiwiState) => state.views,
    mediakiwiSections: (state: MediaKiwiState) => state.sections,
    mediakiwiNavigationItems: (state: MediaKiwiState) => state.navigationItems,
    mediakiwiRoles: (state: MediaKiwiState) => state.roles,
  },
  actions: {
    async init() {
      // load new data from API (positioning matters => section, screens, navigationItems)
      await this.getSections();
      await this.getViews();
      await this.getNavigationItems();
      await this.getRoles();
    },
    async getRoles() {
      const connector = container.resolve<IRoleConnector>("IRoleConnector");
      const roles = await connector.GetRoles();
      this.setRoles(roles);
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
    setRoles(payload: ListResult<Role>) {
      if (payload) {
        this.roles = payload.result;
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
    getParentPath(navigationItem: NavigationItem): string {
      // get the full path for this item by recursively going up the tree
      let parentPath = "";
      if (navigationItem.parentNavigationItemId != null) {
        const parent = this.navigationItems.find((item: NavigationItem) => item.id == navigationItem.parentNavigationItemId);
        if (parent !== undefined) {
          parentPath = this.getParentPath(parent);
        }
      }
      let result = parentPath + `/${navigationItem.name}`;
      // if dynamic, add parameter
      if (navigationItem.isDynamicRoute && navigationItem.dynamicRouteParameterName) {
        result += `/:${navigationItem.dynamicRouteParameterName}`;
      }
      return result;
    },
  },
});
