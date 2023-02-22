import { defineStore } from "pinia";
import type { INavigationItem } from "@/models/navigation"; 
import { NavigationAPIServices, ScreenAPIServices, SectionAPIServices } from "@/services";
import type ListResult from "@/models/api/ListResult";
import type { IScreen } from "@/models/screen/IScreen";
import type ISection from "@/models/section/ISection";

type MediaKiwiState = {
    navigationItems: Array<INavigationItem>;
    screens: Array<IScreen>;
    sections: Array<ISection>;
  };
export const useMediakiwiStore = defineStore({
        id: "mediaKiwiStore",
        state: () =>
        ({
            navigationItems: [],
            screens: [],
            sections: []
        } as MediaKiwiState),
        getters: {
            mediakiwiScreens: (state: MediaKiwiState) => state.screens,
            mediakiwiSections: (state: MediaKiwiState) => state.sections,
            mediakiwiNavigationItems: (state: MediaKiwiState) => state.navigationItems
        },
        actions: {
            async GET_NAVIGATION_ITEMS(state: MediaKiwiState, sectionId: number){
                //TODO: START UI loading 
                return await NavigationAPIServices.GetNavigationItems(sectionId)
                .then((response: ListResult<INavigationItem>) => {
                    this.SET_NAVIGATION_ITEMS(state, response);
                })
                .then(() => {
                    // TODO: STOP UI loading
                });
            },
            async GET_SCREENS(state: MediaKiwiState, sectionId: number){
                //TODO: START UI loading 
                return await ScreenAPIServices.GetScreens(sectionId)
                .then((response: ListResult<IScreen>) => {
                    this.SET_SCREENS(state, response);
                })
                .then(() => {
                    // TODO: STOP UI loading
                });
            },
            async GET_SECTIONS(state: MediaKiwiState){
                //TODO: START UI loading 
                return await SectionAPIServices.GetSections()
                .then((response: ListResult<ISection>) => {
                    this.SET_SECTIONS(state, response);
                })
                .then(() => {
                    // TODO: STOP UI loading
                });
            },
            SET_NAVIGATION_ITEMS(state: MediaKiwiState, payload: ListResult<INavigationItem>){
                if (payload) {
                    state.navigationItems = payload.result;
                    state.navigationItems.forEach((item) =>{
                        item.path = this.CALCULATE_PATH(state, item);
                    })
                }
            },
            SET_SCREENS(state: MediaKiwiState, payload: ListResult<IScreen>){
                if (payload) {
                    state.screens = payload.result;
                }
            },
            SET_SECTIONS(state: MediaKiwiState, payload: ListResult<ISection>){
                if (payload) {
                    state.sections = payload.result;
                }
            },
            CALCULATE_PATH(state: MediaKiwiState, payload: INavigationItem): string{
                // get the full path for this item by recursively going up the tree
                let parentPath: string = "";
                if (payload.parentNavigationItemId != null) {
                    const parent = state.navigationItems.find((item: INavigationItem) => item.id == payload.parentNavigationItemId);
                if (parent !== undefined) {
                    parentPath = this.CALCULATE_PATH(state, parent);
                }
                }
                return parentPath + `/${payload.name}`;
            }
        }
});
