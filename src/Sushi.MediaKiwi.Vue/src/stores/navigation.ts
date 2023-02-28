import { defineStore } from "pinia";
import type { INavigationItem } from "@/models/navigation"; 
import { useMediakiwiStore } from ".";
import type ISection from "@/models/section/ISection";
import useRouter from "@/router";
// import router from "@/router";

type NavigationState = {
    navigationItems: Array<INavigationItem>;
    sectionItems: Array<ISection>;
    currentSection: ISection | undefined;
};

export const useNavigationStore = defineStore({
        id: "navigationStore",
        state: () =>
        ({
            navigationItems: [],
            sectionItems: [],
            currentSection: {
                id: 0,
                name: "Home",
                sortOrder: 0
            }

        } as NavigationState),
        getters: {
            navigationList: (state: NavigationState) => state.navigationItems,
        },
        actions: {
            GET_NAVIGATION(){
                // grab the items from the main store
                const mediaKiwiStore = useMediakiwiStore();
                const items = mediaKiwiStore.navigationItems;
                const sections = mediaKiwiStore.sections;

                // set sections
                if (sections) {
                    this.sectionItems = sections;
                }
                // set items
                if (items) {
                    this.navigationItems = items.filter(x => x.sectionId === this.currentSection?.id);
                }
            },
            GET_CHILDREN_LIST(state: NavigationState, id: number): Array<INavigationItem>{
                if (id) {
                    return state.navigationItems.filter((item) => item.parentNavigationItemId == id);
                }
                return [];
            },
            SET_CURRENT_SECTION( name: string): void{
                if (name && this.sectionItems) {
                    this.currentSection = this.sectionItems.find(x => x.name == name);
                }
                this.GET_NAVIGATION();
                return;
            },
            NAVIGATE_TO(path: string, isSection: boolean){
                // if it's the section, then we reset the navigation
                if (isSection) {
                    this.SET_CURRENT_SECTION(path);
                }
                // hook up router
                const { router } = useRouter();

                if (path && router.value) {
                    // called to send user to target screen
                    router.value.push(path);
                    console.log(path);

                }
                console.log(router.value);
                
            },
        }
});
