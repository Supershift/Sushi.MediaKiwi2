import { defineStore } from "pinia";
import type { Role } from "@/models/api";
import type ListResult from "@/models/api/ListResult";
import { VuetifyOptions } from "vuetify";
import { ApiNavigationProvider, INavigationProvider } from "@/navigation";
import { NavigationTree } from "@/models/navigation";
import { RouteLocationRaw } from "vue-router";
import { useMediaKiwiApi } from "@/services";
import { inject } from "vue";
import { MediakiwiVueOptions } from "@/models";

export interface MediaKiwiState {
  navigationTree: NavigationTree;
  navigationBackUrlOverwrite?: RouteLocationRaw | undefined;
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
    async init(mediakiwiVueOptions?: MediakiwiVueOptions) {
      // check if this is the first call
      if (isInitialized === undefined) {
        // start initializing
        isInitialized = this.loadFromSources(mediakiwiVueOptions);
      }

      // return the initialization promise
      return await isInitialized;
    },
    /* Load the navigation tree and roles from the sources. Do not invoke directly unless forcing a reload, use init() instead. */
    async loadFromSources(mediakiwiVueOptions?: MediakiwiVueOptions) {
      await this.getRoles();
      const provider = mediakiwiVueOptions?.navigationProvider ?? new ApiNavigationProvider();
      this.navigationTree = await provider.GetTreeAsync();
    },
    async getRoles() {
      const mediaKiwiApi = useMediaKiwiApi();
      const response = await mediaKiwiApi.apiRolesList();
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
