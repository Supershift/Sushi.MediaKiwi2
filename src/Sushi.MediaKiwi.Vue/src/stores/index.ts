import { defineStore, DefineStoreOptions } from "pinia";
import type { INavigationItem } from "@/models/navigation";
import { INavigationConnector, NavigationConnector, ScreenAPIServices, SectionAPIServices } from "@/services";
import type ListResult from "@/models/api/ListResult";
import type { IScreen } from "@/models/screen/IScreen";
import type ISection from "@/models/section/ISection";
import { store } from "@/stores/mediakiwi/mock";
import { container } from "tsyringe";

const mockStore = store;

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
    init() {
      this.getNavigationItems();
      this.getSections();
      this.getScreens();
    },
    async getNavigationItems() {
      // get instance of INavigationConnector
      const connector = container.resolve<INavigationConnector>("INavigationConnector");
      // get nav items and store them
      var navigationItems = await connector.GetNavigationItems();

      this.setNavigationItems(navigationItems);
    },
    async getScreens() {
      if (this.isLocal) {
        this.screens = mockStore.screens;
        return;
      }
      //TODO: START UI loading
      return await ScreenAPIServices.GetScreens()
        .then((response: ListResult<IScreen>) => {
          this.setScreens(response);
        })
        .then(() => {
          // TODO: STOP UI loading
        })
        .then(() => {
          if (this.screens.length === 0) {
            console.log("Empty screens, Mocking now!");
            this.screens = mockStore.screens;
          }
        });
    },
    async getSections() {
      if (this.isLocal) {
        this.sections = mockStore.sections;
        return;
      }
      //TODO: START UI loading
      return await SectionAPIServices.GetSections()
        .then((response: ListResult<ISection>) => {
          this.setSections(response);
        })
        .then(() => {
          // TODO: STOP UI loading
        })
        .then(() => {
          if (this.sections.length === 0) {
            console.log("Empty sections, Mocking now!");
            this.sections = mockStore.sections;
          }
        });
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
