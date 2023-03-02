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
            async GET_NAVIGATION_ITEMS(){
                //TODO: START UI loading 
                return await NavigationAPIServices.GetNavigationItems()
                .then((response: ListResult<INavigationItem>) => {
                    this.SET_NAVIGATION_ITEMS(response);
                })
                .then(() => {
                    // TODO: STOP UI loading
                });
            },
            async GET_SCREENS(){
                //TODO: START UI loading 
                return await ScreenAPIServices.GetScreens()
                .then((response: ListResult<IScreen>) => {
                    this.SET_SCREENS(response);
                })
                .then(() => {
                    // TODO: STOP UI loading
                });
            },
            async GET_SECTIONS(){
                //TODO: START UI loading 
                return await SectionAPIServices.GetSections()
                .then((response: ListResult<ISection>) => {
                    this.SET_SECTIONS(response);
                })
                .then(() => {
                    // TODO: STOP UI loading
                });
            },
            SET_NAVIGATION_ITEMS(payload: ListResult<INavigationItem>){
                if (payload) {
                    this.navigationItems = payload.result;
                    this.navigationItems.forEach((item) =>{
                        item.path = this.CALCULATE_PATH(item);
                    })
                }
            },
            SET_SCREENS(payload: ListResult<IScreen>){
                if (payload) {
                    this.screens = payload.result;
                }
            },
            SET_SECTIONS(payload: ListResult<ISection>){
                if (payload) {
                    this.sections = payload.result;
                }
            },
            CALCULATE_PATH(payload: INavigationItem): string{
                // get the full path for this item by recursively going up the tree
                let parentPath: string = "";
                if (payload.parentNavigationItemId != null) {
                    const parent = this.navigationItems.find((item: INavigationItem) => item.id == payload.parentNavigationItemId);
                if (parent !== undefined) {
                    parentPath = this.CALCULATE_PATH(parent);
                }
                }
                return parentPath + `/${payload.name}`;
            }
        }
});