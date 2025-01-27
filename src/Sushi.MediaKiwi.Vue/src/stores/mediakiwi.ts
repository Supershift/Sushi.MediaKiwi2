import { defineStore } from "pinia";
import type { Role } from "@/models/api";
import type ListResult from "@/models/api/ListResult";
import { container } from "tsyringe";
import { VuetifyOptions } from "vuetify";
import { INavigationProvider } from "@/navigation";
import { NavigationTree } from "@/models/navigation";
import { useMediaKiwiApi } from "@/services";
import { RouteLocationAsPathGeneric } from "vue-router";

export interface MediaKiwiState {
  navigationTree: NavigationTree;
  navigationBackUrlOverwrite: Map<string, RouteLocationAsPathGeneric>;
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
      navigationBackUrlOverwrite: new Map<string, RouteLocationAsPathGeneric>(),
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
      const mediaKiwiApi = useMediaKiwiApi();
      const response = await mediaKiwiApi.roles();
      this.setRoles({
        ...response.data,
        result: response.data.result?.map((t) => ({ ...t, id: t.id ?? "" })) ?? [],
        totalCount: response.data?.totalCount ?? undefined,
        pageCount: response.data?.pageCount ?? undefined,
      });
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
