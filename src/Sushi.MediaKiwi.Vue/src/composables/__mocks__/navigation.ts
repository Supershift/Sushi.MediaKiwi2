import { NavigationItem } from "@/models/navigation";
import { ObjectNavigationProvider, Section } from "@/navigation/ObjectNavigationProvider";
import { MediaKiwiState } from "@/stores";
import { RouteLocationAsPathGeneric, RouteLocationNormalizedLoadedGeneric, RouteLocationRaw, RouteQueryAndHash } from "vue-router";

// create nav tree
const sections: Section[] = 
[
  {
    id: '1',
    name: 'Admin Section',
    roles: ['admin'],
    items: [
      {
        id: '0',
        name: 'Landing',
        componentKey: 'landingView',
        children: [
          {
            id: '1',
            name: 'Home',
            componentKey: 'homeView',
            children: [
              {
                id: '2',
                componentKey: 'detailView',
                name: 'Detail',
                parameterName: 'itemId'                
              },
              {
                id: '3',
                componentKey: 'detailView2',
                name: 'Detail2',
                parameterName: 'itemId'
              }]
          }
        ]
      }]
  }
  ,
  {
    id: '2',
    name: 'Public Section',
    roles: [],
    items: []
  }
];

const provider = new ObjectNavigationProvider();
provider.SetTree(sections);
const tree = await provider.GetTreeAsync();
export const mockMediakiwiStore: MediaKiwiState = {
  navigationTree: tree,
  navigationBackUrlOverwrite: new Map<string, RouteLocationAsPathGeneric>(),
  roles: [{ id: 'admin' }],
  isLocal: true,
  rail: true,
  drawer: true,
  externalIcons: false
};

export const mockRouteMeta = {
  meta: {
    navigationItem: tree.getAllNavigationItems().find(n => n.id === '2')
  },
  params: { itemId: "1" },
};

export const mockRoutes = [
  {
    path: '/',
    name: 'Home',
    component: { template: '<div>Home</div>' },
    meta: { navigationItem: { id: '1', name: 'Home', path: 'test', parent: { id: '2', name: 'Detail', path: 'test0' } } },
  },
  {
    path: '/details/:itemId',
    name: 'Detail',
    component: { template: '<div>details</div>' },
    meta: { navigationItem: { id: '2', name: 'Detail', parent: { id: '1', name: 'Home' } } },
  },
  {
    path: '/landing',
    name: 'Landing',
    component: { template: '<div>Landing...</div>' },
    meta: { navigationItem: { id: '0', name: 'Landing' } },
  },
];

export const mockNavigationItemsAsRoot = <NavigationItem>{
  id: 'root',
  children: [
    {
      id: 'child1',
      parent: this, // Simulating parent reference
      children: [
        {
          id: 'grandchild1',
          parent: this, // Simulating parent reference
          children: [{ id: 'greatGrandchild1', parent: this }] // Simulating deep nesting
        }
      ]
    },
    { id: 'child2', parent: this, children: [] },
  ],
};

