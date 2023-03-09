import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from 'pinia'
import { useMediakiwiStore } from "../../../stores";


const sectionPayload = {
    result: [{
        id: 0,
        name: 'Home',
        sortOrder: 0,
        icon: 'mdi-home'
    }],
    totalCount: 1,
    pageCount: 1,
}
const screenPayload = {
    result: [{
        id: 1,
        componentFileName: 'Screen1',
        sectionId: 1,
        name: 'Screen 1'
    }],
    totalCount: 1,
    pageCount: 1,
}
const navigationItemsPayload = {
    result: [{
        id: 0,
        name: 'Home',
        screenId: 0,
        sectionId: 0,
        parentNavigationItemId: null,
        path: '/Home'
    }],
    totalCount: 1,
    pageCount: 1,
}
describe("NavigationStore", () => {
    beforeEach(() => {
        // creates a fresh pinia and make it active so it's automatically picked
        // up by any useStore() call without having to pass it to it:
        // `useStore(pinia)`
        setActivePinia(createPinia())

    })
    it("Should setNavigationItems", () => {
        // define store
        const mediakiwiStore = useMediakiwiStore();
        
        // expect empty arrays
        expect(mediakiwiStore.mediakiwiNavigationItems).lengthOf(0);

        // populate store
        mediakiwiStore.setNavigationItems(navigationItemsPayload);

        // expect things to be filled with data
        expect(mediakiwiStore.mediakiwiNavigationItems).lengthOf.greaterThan(0);
    });
    it("Should setScreens", () => {
        // define store
        const mediakiwiStore = useMediakiwiStore();
        
        // expect empty arrays
        expect(mediakiwiStore.mediakiwiScreens).lengthOf(0);

        // populate store
        mediakiwiStore.setScreens(screenPayload);

        // expect things to be filled with data
        expect(mediakiwiStore.mediakiwiScreens).lengthOf.greaterThan(0);
    });
    it("Should setSections", () => {
        // define store
        const mediakiwiStore = useMediakiwiStore();
        
        // expect empty arrays
        expect(mediakiwiStore.mediakiwiSections).lengthOf(0);

        // populate store
        mediakiwiStore.setSections(sectionPayload);

        // expect things to be filled with data
        expect(mediakiwiStore.mediakiwiSections).lengthOf.greaterThan(0);
    });
    it("Should Populate screens", () => {
        // define store
        const mediakiwiStore = useMediakiwiStore();
        
        // expect empty arrays
        expect(mediakiwiStore.mediakiwiScreens).lengthOf(0);

        // populate store
        mediakiwiStore.getScreens();

        // expect things to be filled with data
        expect(mediakiwiStore.mediakiwiScreens).lengthOf.greaterThan(0);
    });
    it("Should Populate sections", () => {
        // define store
        const mediakiwiStore = useMediakiwiStore();
        
        // expect empty arrays
        expect(mediakiwiStore.mediakiwiSections).lengthOf(0);

        // populate store
        mediakiwiStore.getSections();

        // expect things to be filled with data
        expect(mediakiwiStore.mediakiwiSections).lengthOf.greaterThan(0);
    });
    it("Should Populate navigationItems", () => {
        // define store
        const mediakiwiStore = useMediakiwiStore();
        
        // expect empty arrays
        expect(mediakiwiStore.mediakiwiNavigationItems).lengthOf(0);

        // populate store
        mediakiwiStore.getNavigationItems();

        // expect things to be filled with data
        expect(mediakiwiStore.mediakiwiNavigationItems).lengthOf.greaterThan(0);
    });
    it("Should Populate everything with init", () => {
        // define store
        const mediakiwiStore = useMediakiwiStore();
        
        // expect empty arrays
        expect(mediakiwiStore.mediakiwiNavigationItems).lengthOf(0);
        expect(mediakiwiStore.mediakiwiScreens).lengthOf(0);
        expect(mediakiwiStore.mediakiwiSections).lengthOf(0);

        // populate store
        mediakiwiStore.init();

        // expect things to be filled with data
        expect(mediakiwiStore.mediakiwiSections).lengthOf.greaterThan(0);
        expect(mediakiwiStore.mediakiwiNavigationItems).lengthOf.greaterThan(0);
        expect(mediakiwiStore.mediakiwiScreens).lengthOf.greaterThan(0);
    });
});

