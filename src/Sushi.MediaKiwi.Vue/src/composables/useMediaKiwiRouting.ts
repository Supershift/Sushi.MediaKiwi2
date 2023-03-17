import { useMediakiwiStore } from "@/stores";
import { useNavigationStore } from "@/stores/navigation";
import { type Router } from "vue-router";

/*
  Returns the routing functions using the store and routers of mediakiwi
*/
export default function() {
    const navigationStore = useNavigationStore();
    const mediakiwiStore = useMediakiwiStore();

    const navigateToScreen = (router: Router, screenId: number, isSection: boolean): void => {        
        // Since we are injecting the router via the sotre it is already up and running when we initiate
        if (screenId && router) {
            const navigationItem = mediakiwiStore.mediakiwiNavigationItems.find((x) => x.screenId == screenId);
            // if it's the section, then we reset the navigation
            if (isSection) {
                navigationStore.setCurrentSection(navigationItem);
            }
            // called to send user to target screen
            router.push(navigationItem?.path ?? "/Home");
        }
    }
    
    return {
        navigateToScreen,
    }
}