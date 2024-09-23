import { defineStore } from "pinia";
import type { Role } from "@/models/api";
import type ListResult from "@/models/api/ListResult";
import { container } from "tsyringe";
import { IRoleConnector } from "@/services/IRoleConnector";
import { VuetifyOptions } from "vuetify";
import { INavigationProvider } from "@/navigation";
import { NavigationTree } from "@/models/navigation";

export interface MediaKiwiState {
  navigationTree: NavigationTree;
  roles: Role[];
  isLocal: boolean;
  drawer: boolean;
  externalIcons: boolean;
}

var isInitialized: Promise<void> | undefined = undefined;

export const useMediakiwiStore = defineStore({
  id: "mediaKiwiStore",
  state: () =>
  ({
    navigationTree: new NavigationTree([]),
    roles: [],
    isLocal: true,
    drawer: true,
    externalIcons: false,
  } as MediaKiwiState),
  actions: {
    async init() {
      // check if this is the first call
      if (isInitialized === undefined) {
        // start initializing
        isInitialized = this.loadFromSources();
      }

      // return the initialization promise
      return await isInitialized;
    },
    /* Load the navigation tree and roles from the sources. Do not invoke directly unless forcing a reload, use init() instead. */
    async loadFromSources() {
      await this.getRoles();
      const provider = container.resolve<INavigationProvider>("INavigationProvider");
      this.navigationTree = await provider.GetTreeAsync();
    },
    async getRoles() {
      const connector = container.resolve<IRoleConnector>("IRoleConnector");
      const roles = await connector.GetRoles();
      this.setRoles(roles);
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    setRoles(payload: ListResult<Role>) {
      if (payload) {
        this.roles = payload.result;
      }
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
