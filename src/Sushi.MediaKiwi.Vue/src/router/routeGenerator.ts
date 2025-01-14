import { NavigationItem, NavigationTree } from "@/models/navigation";
import { injectable } from "tsyringe";
import { RouteComponent, RouteRecordRaw } from "vue-router";


@injectable()
export class RouteGenerator {
  constructor() { }

  getPath(navigationItem: NavigationItem): string {
    // get the full path for this item by recursively going up the tree
    let parentPath = "";
    if (navigationItem.parent) {
      parentPath = this.getPath(navigationItem.parent);
    } else {
      // no more parent items, use the section as root parent      
      parentPath = `/${navigationItem.section.name}`;
    }
    let result = parentPath + `/${encodeURI(navigationItem.name)}`;
    // if dynamic, add parameter
    if (navigationItem.parameterName) {
      result += `/:${navigationItem.parameterName}?`;
    }
    return result;
  }

  /** Generates routes based on navigation items and modules */
  public generateRoutes(modules: Record<string, RouteComponent>, navigationTree: NavigationTree): RouteRecordRaw[] {
    const result: RouteRecordRaw[] = [];
    // add new routes for navigation items
    navigationTree.getAllNavigationItems().forEach((navigationItem: NavigationItem) => {
      if (navigationItem.componentKey && modules) {
        // determine path
        const path = this.getPath(navigationItem);

        // find the module referenced by the nav item
        const module = modules[navigationItem.componentKey];
        if (module !== undefined) {
          // add a route to the module
          const route = <RouteRecordRaw>{
            path: path,
            name: navigationItem.id.toString(),
            component: module,
            meta: {
              isFromServer: true,
              requiresAuth: true,
              requiresRole: navigationItem.roles,
              navigationItem: navigationItem,
              layout: navigationItem.layout,
            },
          };

          result.push(route);
        } else {
          // no module found, give a warning
          console.warn(`No module found for nav item ${navigationItem.id}, component key: ${navigationItem.componentKey}`);
        }
      }
    });

    // add a catch-all route to redirect to the home page
    result.push(<RouteRecordRaw>{
      path: "/:catchAll(.*)",
      name: "PageNotFound",
      component: modules.MkPageNotFound,
      meta: {
        title: "404 - Page not found",
      },
    });

    return result;
  }
}
