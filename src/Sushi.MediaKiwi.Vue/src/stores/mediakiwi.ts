import { defineStore } from "pinia";
import type { NavigationItem, Role, Section, View } from "@/models/api";
import type { INavigationConnector, IViewConnector, ISectionConnector } from "@/services";
import type ListResult from "@/models/api/ListResult";
import { container } from "tsyringe";
import { IRoleConnector } from "@/services/IRoleConnector";
import { noPageSize } from "@/constants";
import { VuetifyOptions } from "vuetify";
import { INavigationProvider } from "@/navigation";

export interface MediaKiwiState {
  navigationItems: Array<NavigationItem>;
  views: Array<View>;
  sections: Array<Section>;
  roles: Role[];
  isLocal: boolean;
  drawer: boolean;
  externalIcons: boolean;
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
    externalIcons: false,
  } as MediaKiwiState),
  getters: {
    rootNavigationItems: (state: MediaKiwiState) => state.navigationItems.filter((x) => x.parentNavigationItemId == null),
  },
  actions: {
    async init() {
      await this.getRoles();
      const provider = container.resolve<INavigationProvider>("INavigationProvider");
      this.sections = await provider.GetSectionsAsync();
      this.views = await provider.GetViewsAsync();
      this.navigationItems = await provider.GetNavigationItemsAsync();
      this.resolveNavigationItems();
    },
    async getRoles() {
      const connector = container.resolve<IRoleConnector>("IRoleConnector");
      const roles = await connector.GetRoles();
      this.setRoles(roles);
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    resolveNavigationItems() {
      // add view to items
      this.navigationItems.forEach((item) => {
        item.view = this.views.find((x) => x.id === item.viewId);
      });
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
      // if an item has dynamic children, it has 'item navigation'
      this.navigationItems.forEach((item) => {
        if (item?.children?.some((x) => x.view?.parameterName)) item.hasItemNavigation = true;
      });
    },
    setRoles(payload: ListResult<Role>) {
      if (payload) {
        this.roles = payload.result;
      }
    },
    getParentName(navigationItem: NavigationItem): string {
      if (navigationItem.parent) {
        return this.getParentName(navigationItem.parent);
      }

      return navigationItem.name;
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
      if (navigationItem.view?.parameterName) {
        result += `/:${navigationItem.view.parameterName}?`;
      }
      return result;
    },
    registerIcons(options: VuetifyOptions) {
      if (options && options.icons !== undefined) {
        this.externalIcons = true;
      } else {
        this.externalIcons = false;
      }
    },
  },
});
