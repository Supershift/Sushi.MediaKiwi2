# Navigation
Navigation allows the user to move between different pages. MediaKiwi has a tree which allows you to build navigation. It uses VueRouter.

## Core concepts

### Section
A section is used to categorize navigation items. Sections form the base of the navigation tree. They are displayed in the navigation rail.

### Navigation item
A navigation item can be used for two purposes: 
- link to a view
- further categorization of items in folders

Navigation items are displayed in the navigation drawer. Only items for the currently selected section are visible.

The navigation tree can be visualised as follows:
- Section 1
    - Item 1.1 <-- points to a view
    - Item 1.2
- Section 2
    - Item 2.1
    - Item 2.2
    - Item 2.3 <-- folder
        - Item 2.3.1
        - Item 2.3.2

### Component key
In the context of navigation, a component key refers to a Vue component which you want to load as a screen when clicking a navigation item. They are provided as 'modules' when installing MediaKiwi. More info can be found [here](Setup/MediakiwiVueOptions.md).

## Navigation provider
The navigation tree can be defined using a navigation provider. By default, MediaKiwi uses the ApiNavigationProvider. 

The desired navigation provider can be set on MediaKiwiVueOptions:
```tsx
import { ApiNavigationProvider } from "@/navigation";

const apiNavigationProvider = new ApiNavigationProvider();
const mediakiwiOptions : MediakiwiVueOptions = {  
  apiBaseUrl: import.meta.env.VITE_APP_MEDIAKIWI_APIBASEURL,
  navigationProvider: apiNavigationProvider,
  ... etc  
};

const app = createApp(App);
app.use(mediakiwi, mediakiwiOptions);
```

### Api Navigation Provider
Pulls sections and navigation items from the API. This allows the tree to be managed indepedently from code releases.
### Object Navigation Provider
Allows the tree to be defined using objects. 

Pros:
- Easy
- Testable

Cons:
- Changes require release

Sample:
```tsx
const sections: SimpleSection[] = 
[
  {
    id: 'Home',
    name: 'Home Section',
    roles: [],
    items: [
      {
        id: 'Landing',
        name: 'Landing',
        componentKey: 'landingView',
        children: [
          {
            id: 'Home',
            name: 'Home',
            componentKey: 'homeView',
            children: [
              {
                id: 'Detail',
                componentKey: 'detailView',
                name: 'Detail',
                parameterName: 'itemId',
                children: []
              }]
          }
        ]
      }]
  }
  ,
  {
    id: '2',
    name: 'Admin Section',
    roles: ['Admin'],
    items: [
      {
        id: 'Settings',
        name: 'Settings',
        componentKey: 'settings.vue',
        children: []
      }
    ]
  }
];

const provider = new ObjectNavigationProvider();
provider.SetTree(sections);
```

## Pass parameter to an item
You can pass an url parameter to a navigation item by using 'parameterName'. For example:
```tsx
{
  id: 'Home',
  name: 'My home',
  componentKey: 'homeView',
  children: [
    {
      id: 'Detail',
      componentKey: 'detailView',
      name: 'My detail',
      parameterName: 'itemId',
      children: []
    }]
}
```
The registered route will be: /My%20home/My%20detail/:itemId

To send a user to a route like '/My%20home/My%20detail/abc-123' this statement can be used:
```tsx
import { useNavigation } from "@/composables";

const navigation = useNavigation();
navigation.navigateToId('Detail', 'abc-123');
```
And the value 'abc-123' can be retrieved in the target view with:
```tsx
const itemId = navigation.currentViewParameter;
```

Make sure parameter names are unique for a path in the tree. A route like this will result in warnings and errors: /Hotels/HotelDetail/:itemId/Rooms/:itemId