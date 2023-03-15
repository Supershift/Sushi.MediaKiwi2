import { IBreadcrumbItem } from "@/models/navigation/IBreadcrumbItem";
import { useRouter } from "@/router";
import { useMediakiwiStore } from "@/stores";
import { useNavigationStore } from "@/stores/navigation";
import { Ref, ref } from "vue";
import { Router } from "vue-router";

/*
  Returns the routing functions using the store and routers of mediakiwi
*/
export default function () {
    const navigationStore = useNavigationStore();
    const mediakiwiStore = useMediakiwiStore();

    const navigateToScreen = (router: Router, screenId: number, isSection: boolean) => {        
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

    /*
      Returns the breadcrumb list for the breadcrumb component
      Builds this everytime we navigate so that this is populated fast and on time
    */
    const generateBreadCrumbs = (): Ref<Array<IBreadcrumbItem>> =>{
        let breadcrumbs = ref<Array<IBreadcrumbItem>>([]);
        const router = useRouter();
        router.beforeEach((to, from, next) => {
            breadcrumbs.value = [];
            to.matched.forEach((record) => { 
                // for each record we matched with we split this and build the current list of crumbs
                record.path.split("/").forEach((r) => {
                    // ignore empty, null and undefined strings and push this to the list
                    if (r !== undefined && r !== null && r !== "") {
                        // we also need to match the current navigation Items to use its path to build the navigation routing when we click the breadcrumb item
                        const currentItem = navigationStore.navigationList.find(x => x.name.toString() === r.toString());
                        if (currentItem) {
                            if (currentItem.path !== to.path) {
                                // the rest should not be bolded or disabled
                                breadcrumbs.value.push({title: decodeURI(r), disabled: false, bold: false,  href: currentItem.path, to: currentItem?.path ?? "", exact: true});
                            } else {
                                // the last crumb should be disabled and bolded and disabled, since we are currently on it
                                breadcrumbs.value.push({title: decodeURI(r), disabled: true, bold: true, href: currentItem.path, to: currentItem?.path ?? "", exact: true});
                            }
                        }
                    }
                });
            })
            next();
        });
        return breadcrumbs
    }


    return {
        navigateToScreen,
        generateBreadCrumbs,
    }
}