import { NavigationItem, Section, View } from "@/models";

export const mockMediakiwiStore = {
  sections: <Array<Section>>[{ id: '1', name: 'Admin Section', roles: ['admin'] }, { id: '2', name: 'Public Section', roles: [] }],
  rootNavigationItems: <Array<NavigationItem>>[{ id: '1', sectionId: '1', name: 'Home', viewId: 'homeView', path: 'test', parent: { id: '0', name: 'Landing', viewId: 'landingView', path: 'land' } }, { id: '2', sectionId: '1', name: 'Detail', viewId: 'detailView', path: 'test0', parent: { id: '1', name: 'Home', viewId: 'homeView', path: 'test', parent: { id: '0', name: 'Landing', viewId: 'landingView', path: 'land' } } }],
  navigationItems: <Array<NavigationItem>>[{ id: '1', sectionId: '1', name: 'Home', viewId: 'homeView', path: 'test', parent: { id: '0', name: 'Landing', viewId: 'landingView', path: 'land' } }, {
    id: '2', sectionId: '1', name: 'Detail', viewId: 'detailView', path: 'test0', parent: {
      id: '1', name: 'Home', viewId: 'homeView', path: 'test', parent: {
        id: '0', name: 'Landing', viewId: 'landingView', path: 'land'
      }
    }
  }],
  views: <Array<View>>[{ id: 'homeView', name: 'Home View' }, { id: 'detailView', name: 'Detail View', parameterName: "itemId" }, { id: 'landingView', name: 'Landing View' }],
};

export const mockNavigationItemChildren = <Array<NavigationItem>>[
  {
    id: 'child1',
    view: { id: 'child1', name: 'Child 1' }
  }, {
    id: 'child2',
    view: { id: 'child2', name: 'Child 2' }
  }, {
    id: 'child3',
    view: {}
  },
  length = 3
];

export const mockNavigationItemWithoutChildren = <NavigationItem>{
  id: '3',
  name: 'Settings',
  path: 'test2',
  viewId: 'settingsView',
};

export const mockRouteMeta = {
  meta: {
    navigationItem: <NavigationItem>{
      id: '2',
      name: 'Detail',
      path: 'test0',
      viewId: 'detailView',
      sectionId: '1',
      view: {
        id: 'detailView',
        name: 'Detail View',
        parameterName: "itemId"
      },
      parent: {
        id: '1',
        name: 'Home',
        viewId: 'homeView',
        path: 'test',
        parent: {
          id: '0',
          name: 'Landing',
          viewId: 'landingView',
          path: 'land'
        },
        children: [
          {
            id: '2',
            name: 'Detail',
            path: 'test0',
            viewId: 'detailView',
          },
          length = 1
        ],
        hasItemNavigation: true
      },
      children: mockNavigationItemChildren,
      hasItemNavigation: true
    }
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

export const mockAdminSections = [{ id: "1", roles: ['admin'], name: 'Admin Section' }];

export const mockNavigationItemsAsRoot = <NavigationItem>{
  id: 'root',
  hasItemNavigation: true,
  children: [
    {
      id: 'child1',
      hasItemNavigation: false,
      parent: this, // Simulating parent reference
      children: [
        {
          id: 'grandchild1',
          hasItemNavigation: true,
          parent: this, // Simulating parent reference
          children: [{ id: 'greatGrandchild1', hasItemNavigation: false, parent: this }] // Simulating deep nesting
        }
      ]
    },
    { id: 'child2', hasItemNavigation: true, parent: this, children: [] },
  ],
};

