import type { App } from 'vue'
import { store } from '../src/mkstore'
import { createRouter, RouterOptions, RouteRecordRaw, createWebHashHistory } from 'vue-router'

export function addRoutes(app: App) {
    // get all navigation items and screens
    var screens = store.screens;
    var navigationItems = store.navigationItems;

    // create routes    
    const routes = <RouteRecordRaw[]>[];    
    navigationItems.forEach((navigationItem) => {
        // if the navigation item points to a screen, get the screen
        if (navigationItem.screenId != null && navigationItem.screenId !== undefined) {
            var screen = screens.find(x => x.id == navigationItem.screenId);
            
            if (screen != null && screen !== undefined) {                
                var route = <RouteRecordRaw>
                    {
                        path: `/${navigationItem.name}`,                        
                        component: () => import(/* @vite-ignore */`./components/${screen?.componentFileName}`)
                    };
                routes.push(route);
            }
        }
    });

    // add default route
    routes.push({ path: '/', component: () => routes[0].component});

    const routerOptions = <RouterOptions>
        {
            routes: routes,
            history: createWebHashHistory()
        };
    const router = createRouter(routerOptions);

    app.use(router);
}