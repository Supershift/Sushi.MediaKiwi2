import { type IBreadcrumb, Breadcrumb } from "@/models/breadcrumb";
import { useNavigationStore } from "@/stores/navigation";
import { type Router } from "vue-router";

/**
 * Register the breadcrumbs once, the crumbs are populated right before we navigate
 * Then we refresh this by updating the store
 */
export default function registerBreadcrumbs(router: Router): void{
    const navigationStore = useNavigationStore();

    // before each router navigation we would want to update the breadcrumbs
    router.beforeEach((to, from, next) => {
        const breadcrumbs = Array<IBreadcrumb>();
        to.matched.forEach((record) => { 
            // for each record we matched with we split this and build the current list of crumbs
            record.path.split("/").forEach((r) => {
                // ignore empty, null and undefined strings and push this to the list
                if (r !== undefined && r !== null && r !== "") {
                    // we also need to match the current navigation Items to use its path to build the navigation routing when we click the breadcrumb item
                    const currentItem = navigationStore.navigationList.find((x) => x.name.toString() === r.toString());
                    if (currentItem) {
                        const navigationPath = currentItem?.path ?? "";
                        if (currentItem.path !== to.path) {
                            // the rest should not be bolded or disabled
                            breadcrumbs.push(new Breadcrumb(navigationPath, decodeURI(r), currentItem.path, true, false, false));
                        } else {
                            // the last crumb should be disabled and bolded and disabled, since we are currently on it
                            breadcrumbs.push(new Breadcrumb(navigationPath, decodeURI(r), currentItem.path, true, false, false));
                        }
                    }
                }
            });
        })
        // finally we set the new breadcrumbs before navigation
        navigationStore.setBreadCrumbs(breadcrumbs);
        
        next();
    });

}