import { useMediakiwiStore } from "@/stores";
import { useNavigationStore } from "@/stores/navigation";
import { Router } from "vue-router";

/*
  Returns the router functions
*/
export default function () {
    const navigationStore = useNavigationStore();
    const mediakiwiStore = useMediakiwiStore();

    const NavigateToScreen = (router: Router, screenId: number, isSection: boolean) => {        
        // Since we are injecting the router via the sotre it is already up and running when we initiate
        if (screenId && router) {
            const navigationItem = mediakiwiStore.mediakiwiNavigationItems.find((x) => x.screenId == screenId);
            // if it's the section, then we reset the navigation
            if (isSection) {
                navigationStore.SET_CURRENT_SECTION(navigationItem);
            }
            console.log(navigationItem)
            // called to send user to target screen
            router.push(navigationItem?.path ?? "/Home");
        }
    }
    return {
        NavigateToScreen
    }
}