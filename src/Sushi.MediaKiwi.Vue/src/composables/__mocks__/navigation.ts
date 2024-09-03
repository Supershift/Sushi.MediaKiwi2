import { NavigationItem, Section } from "@/models/navigation";

const sections = <Array<Section>>[{ id: '1', name: 'Admin Section', roles: ['admin'] }, { id: '2', name: 'Public Section', roles: [] }];

export const mockMediakiwiStore = {
  sections: sections,
  rootNavigationItems: <Array<NavigationItem>>[{ id: '1', section: sections[0], name: 'Home', componentKey: 'homeView', parent: { id: '0', name: 'Landing', componentKey: 'landingView' } }, { id: '2', section: sections[0], name: 'Detail', componentKey: 'detailView', parent: { id: '1', name: 'Home', componentKey: 'homeView', parent: { id: '0', name: 'Landing', componentKey: 'landingView' } } }],
  navigationItems: <Array<NavigationItem>>[{ id: '1', section: sections[0], name: 'Home', componentKey: 'homeView', parent: { id: '0', name: 'Landing', componentKey: 'landingView'} }, {
    id: '2', section: sections[0], name: 'Detail', componentKey: 'detailView', parent: {
      id: '1', name: 'Home', componentKey: 'homeView', parent: {
        id: '0', name: 'Landing', componentKey: 'landingView'
      }
    }
  }]
};

export const mockNavigationItemChildren = <Array<NavigationItem>>[
  {
    id: 'child1',
    componentKey: 'child1' }
  , {
    id: 'child2',
    componentKey: 'child2'
  }, {
    id: 'child3'    
  },
  length = 3
];

export const mockNavigationItemWithoutChildren = <NavigationItem>{
  id: '3',
  name: 'Settings',  
  componentKey: 'settingsView',
};

export const mockRouteMeta = {
  meta: {
    navigationItem: <NavigationItem>{
      id: '2',
      name: 'Detail',      
      componentKey: 'detailView',
      section: sections[0],      
      parent: {
        id: '1',
        name: 'Home',
        componentKey: 'homeView.',        
        parent: {
          id: '0',
          name: 'Landing',
          componentKey: 'landingView',          
        },
        children: [
          {
            id: '2',
            name: 'Detail',            
            componentKey: 'detailView',
          },
          length = 1
        ],        
      },
      children: mockNavigationItemChildren,      
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

