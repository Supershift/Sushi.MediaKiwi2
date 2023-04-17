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
  drawer: boolean;
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
      drawer: true,
    } as MediaKiwiState),
  getters: {
    rootNavigationItems: (state: MediaKiwiState) => state.navigationItems.filter((x) => x.parentNavigationItemId == null),
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
      const views = await connector.GetViews(undefined, { pageSize: 9999 });
      this.setViews(views);
    },
    async getSections() {
      const connector = container.resolve<ISectionConnector>("ISectionConnector");
      const sections = await connector.GetSections();
      this.setSections(sections);
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    setNavigationItems(payload: ListResult<NavigationItem>) {
      if (payload) {
        this.navigationItems = payload.result;
        // add parent/child relations
        this.navigationItems.forEach((item) => {
          // add parent
          item.parent = this.navigationItems.find((x) => x.id == item.parentNavigationItemId);
          // add children
          item.children = this.navigationItems.filter((x) => x.parentNavigationItemId == item.id);
        });
        // add path to all items
        this.navigationItems.forEach((item) => {
          item.path = this.getParentPath(item);
        });
        // add leaf node (dynamic items without children have a different leaf node)
        this.setLeafNodes(this.navigationItems);
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
      if (navigationItem.parent) {
        parentPath = this.getParentPath(navigationItem.parent);
      } else {
        // no more parent items, use the section as root parent
        const sectionName = this.sections.find((x) => x.id === navigationItem.sectionId)?.name;
        parentPath = `/${sectionName}`;
      }
      let result = parentPath + `/${encodeURI(navigationItem.name)}`;
      // if dynamic, add parameter
      if (navigationItem.isDynamicRoute && navigationItem.dynamicRouteParameterName) {
        result += `/:${navigationItem.dynamicRouteParameterName}`;
      }
      return result;
    },
    setLeafNodes(navigationItems: Array<NavigationItem>) {
      // add leaf node (dynamic items without children have a different leaf node)
      navigationItems.forEach((item) => {
        if (item.isDynamicRoute && item.children?.filter((x) => !x.isDynamicRoute)) {
          let candidate: NavigationItem | undefined = item.parent;
          while (candidate && !item.leaf) {
            if (!candidate.isDynamicRoute || candidate.children?.some((x) => !x.isDynamicRoute)) {
              item.leaf = candidate;
            }
            candidate = candidate.parent;
          }
        } else {
          item.leaf = item;
        }
      });
    },
  },
});
