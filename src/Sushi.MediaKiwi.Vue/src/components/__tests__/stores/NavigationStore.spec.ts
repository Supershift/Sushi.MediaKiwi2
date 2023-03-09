import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from 'pinia'
import { useNavigationStore } from '../../../stores/navigation'
import { useMediakiwiStore } from "../../../stores";

const navigationItemHotels = {
  id: 1,
  name: 'Hotels',
  screenId: 1,
  sectionId: 1,
  parentNavigationItemId: null,
  path: '/Hotels'
}

describe("NavigationStore", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  
  })

  it("Should getNavigation from mediakiwiStore", () => {
    // define stores
    const store = useNavigationStore();
    const mediakiwiStore = useMediakiwiStore();

    // expect empty arrays from mediakiwiStore
    expect(mediakiwiStore.mediakiwiNavigationItems).lengthOf(0);
    expect(mediakiwiStore.mediakiwiScreens).lengthOf(0);
    expect(mediakiwiStore.mediakiwiSections).lengthOf(0);

    // expect empty arrays from navigationstore
    expect(store.navigationList).lengthOf(0);
    expect(store.sectionList).lengthOf(0);

    // populate with data
    mediakiwiStore.init();
    
    // gather data from the main mediakiwi store
    store.getNavigation();

    // expect empty arrays from navigationstore
    expect(store.navigationList).lengthOf.greaterThan(0);
    expect(store.sectionList).lengthOf.greaterThan(0);

    console.log(store.navigationList);
    console.log(store.sectionList);
  });
  it("Should get naviagtionItems", () => {
    // define stores
    const store = useNavigationStore();
    const mediakiwiStore = useMediakiwiStore();

    // expect empty arrays from mediakiwiStore
    expect(mediakiwiStore.mediakiwiNavigationItems).lengthOf(0);

    // expect empty arrays from navigationstore
    expect(store.navigationList).lengthOf(0);

    // populate with data
    mediakiwiStore.init();
    
    // gather data from the main mediakiwi store
    store.getNavigation();

    // expect empty arrays from navigationstore
    expect(store.navigationList).lengthOf.greaterThan(0);

    console.log(store.navigationList);
  });
  it("Should get Screens", () => {
    // define store
    const mediakiwiStore = useMediakiwiStore();

    // expect empty arrays from mediakiwiStore
    expect(mediakiwiStore.mediakiwiScreens).lengthOf(0);

    // expect empty arrays from navigationstore
    expect(mediakiwiStore.mediakiwiScreens).lengthOf(0);

    // populate with data
    mediakiwiStore.getScreens();

    // expect empty arrays from navigationstore
    expect(mediakiwiStore.mediakiwiScreens).lengthOf.greaterThan(0);

    console.log(mediakiwiStore.mediakiwiScreens);
  });
  it("Should get Sections", () => {
    // define stores
    const store = useNavigationStore();
    const mediakiwiStore = useMediakiwiStore();

    // expect empty arrays from mediakiwiStore
    expect(mediakiwiStore.mediakiwiSections).lengthOf(0);

    // expect empty arrays from navigationstore
    expect(store.sectionList).lengthOf(0);

    // populate with data
    mediakiwiStore.getSections();
    
    // gather data from the main mediakiwi store
    store.getNavigation();

    // expect empty arrays from navigationstore
    expect(store.sectionList).lengthOf.greaterThan(0);

    console.log(store.sectionList);
  });
  it("Should set section navigationItems", () => {
    // define stores
    const store = useNavigationStore();
    const mediakiwiStore = useMediakiwiStore();

    // expect empty arrays from mediakiwiStore
    expect(mediakiwiStore.mediakiwiNavigationItems).lengthOf(0);
    expect(mediakiwiStore.mediakiwiScreens).lengthOf(0);
    expect(mediakiwiStore.mediakiwiSections).lengthOf(0);

    // expect empty arrays from navigationstore
    expect(store.sectionList).lengthOf(0);
    
    // populate with data
    mediakiwiStore.init();
    
    // gather data from the main mediakiwi store
    store.getNavigation();

    console.log(store.navigationItems);

    // set new section id
    store.setSectionNavigationItems(1);

    console.log(store.navigationItems);
    // expect empty arrays from navigationstore
    expect(store.sectionList).lengthOf.greaterThan(0);
    expect(store.navigationItems).lengthOf.greaterThanOrEqual(2);
  });
  it("Should set current section", () => {
    // define stores
    const store = useNavigationStore();
    const mediakiwiStore = useMediakiwiStore();

    // expect empty arrays from mediakiwiStore
    expect(mediakiwiStore.mediakiwiNavigationItems).lengthOf(0);
    expect(mediakiwiStore.mediakiwiScreens).lengthOf(0);
    expect(mediakiwiStore.mediakiwiSections).lengthOf(0);

    // expect empty arrays from navigationstore
    expect(store.sectionList).lengthOf(0);
    
    // populate with data
    mediakiwiStore.init();
    
    // gather data from the main mediakiwi store
    store.getNavigation();

    console.log(store.navigationItems);

    // set new section id
    store.setCurrentSection(navigationItemHotels);

    console.log(store.navigationItems);
    // expect empty arrays from navigationstore
    expect(store.sectionList).lengthOf.greaterThan(0);
    expect(store.navigationItems).lengthOf.greaterThanOrEqual(2);
  });
});

