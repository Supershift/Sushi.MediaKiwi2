import { defineStore, DefineStoreOptions } from "pinia";
import type { INavigationItem } from "@/models/navigation";
import { INavigationConnector, IScreenConnector, ISectionConnector } from "@/services";
import type ListResult from "@/models/api/ListResult";
import type { IScreen } from "@/models/screen/IScreen";
import type ISection from "@/models/section/ISection";
import { container } from "tsyringe";

export type MediaKiwiState = {
  navigationItems: Array<INavigationItem>;
  screens: Array<IScreen>;
  sections: Array<ISection>;
  isLocal: boolean;
};

export const useMediakiwiStore = defineStore({
  id: "mediaKiwiStore",
  state: () =>
    ({
      navigationItems: [],
      screens: [],
      sections: [],
      isLocal: true,
    } as MediaKiwiState),
  getters: {
    mediakiwiScreens: (state: MediaKiwiState) => state.screens,
    mediakiwiSections: (state: MediaKiwiState) => state.sections,
    mediakiwiNavigationItems: (state: MediaKiwiState) => state.navigationItems,
  },
  actions: {
    async init() {
      // load new data from API
      await this.getNavigationItems();
      await this.getSections();
      await this.getScreens();
    },
    async getNavigationItems() {
      // get instance of INavigationConnector
      const connector = container.resolve<INavigationConnector>("INavigationConnector");
      // get nav items and store them
      var navigationItems = await connector.GetNavigationItems();
      this.setNavigationItems(navigationItems);
    },
    async getScreens() {
      const connector = container.resolve<IScreenConnector>("IScreenConnector");
      var screens = await connector.GetScreens();
      this.setScreens(screens);
    },
    async getSections() {
      const connector = container.resolve<ISectionConnector>("ISectionConnector");
      var sections = await connector.GetSections();
      this.setSections(sections);
    },
    setNavigationItems(payload: ListResult<INavigationItem>) {
      if (payload) {
        this.navigationItems = payload.result;
        this.navigationItems.forEach((item) => {
          item.path = this.getParentPath(item);
        });
      }
    },
    setScreens(payload: ListResult<IScreen>) {
      if (payload) {
        this.screens = payload.result;
      }
    },
    setSections(payload: ListResult<ISection>) {
      if (payload) {
        this.sections = payload.result;
      }
    },
    getParentPath(payload: INavigationItem): string {
      // get the full path for this item by recursively going up the tree
      let parentPath: string = "";
      if (payload.parentNavigationItemId != null) {
        const parent = this.navigationItems.find((item: INavigationItem) => item.id == payload.parentNavigationItemId);
        if (parent !== undefined) {
          parentPath = this.getParentPath(parent);
        }
      }
      return parentPath + `/${payload.name}`;
    },
  },
});
