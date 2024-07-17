import 'reflect-metadata';
import { describe, it, beforeEach, vi, expect, assertType } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useMediakiwiStore, MediaKiwiState } from "../mediakiwi";
import { IMediakiwiServiceRegistrations } from '@/models';
import { container } from 'tsyringe';
import { registerServices } from '@/helpers/registerServices';
import { expectedChangeNavItems, expectedChangeRoles, expectedChangeSections, expectedChangeViews, MockedNavigationConnector, MockedRolesConnector, MockedSectionsConnector, MockedViewsConnector } from '../__mocks__/mediakiwi';
import { VuetifyOptions } from 'vuetify/lib/framework.mjs';

describe("Mediakiwi Store", () => {

  // clearmocks and make the test pinia before each run
  beforeEach(() => {
    // Mock axios
    vi.mock("axios");
    // clear all mocks and reset the container
    container.reset();
    vi.clearAllMocks();
    // create a new pinia instance and set it as active
    setActivePinia(createPinia());
    // register services
    container.register("MediakiwiAxiosInstance", { useValue: {} });

    const registrations = <IMediakiwiServiceRegistrations><unknown>{
      navigationConnector: MockedNavigationConnector,
      sectionConnector: MockedSectionsConnector,
      viewConnector: MockedViewsConnector,
      roleConnector: MockedRolesConnector,
    };
    registerServices(container, registrations);
  });


  // variables in store should be initialized
  it("should have a state that implements the IMediakiwiState", () => {
    // arrange - act
    const mediakiwiStore = useMediakiwiStore();

    // assert
    expect(mediakiwiStore.$state).toBeDefined();
    expect(mediakiwiStore.$id).toBe("mediaKiwiStore");
    expect(mediakiwiStore.$state).toHaveProperty("navigationItems");
    expect(mediakiwiStore.$state).toHaveProperty("views");
    expect(mediakiwiStore.$state).toHaveProperty("sections");
    expect(mediakiwiStore.$state).toHaveProperty("roles");
    expect(mediakiwiStore.$state).toHaveProperty("isLocal");
    expect(mediakiwiStore.$state).toHaveProperty("drawer");
    expect(mediakiwiStore.$state).toHaveProperty("externalIcons");
    assertType<MediaKiwiState>(mediakiwiStore.$state);
  });

  describe("getters", () => {
    it("should return the Root Navigation Items", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      await mediakiwiStore.getNavigationItems();

      // act
      const result = mediakiwiStore.rootNavigationItems;

      // assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });
  });
  describe("actions", () => {
    it("should have an action that gets the Navigation Items", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const getNavigationItemsSpy = vi.spyOn(mediakiwiStore, "getNavigationItems");

      // act
      await mediakiwiStore.getNavigationItems();

      // assert
      expect(getNavigationItemsSpy).toHaveBeenCalled();
      expect(mediakiwiStore.navigationItems).toHaveLength(1);
    });
    it("should have an action that gets the Sections", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const getSectionsSpy = vi.spyOn(mediakiwiStore, "getSections");

      // act
      await mediakiwiStore.getSections();

      // assert
      expect(getSectionsSpy).toHaveBeenCalled();
      expect(mediakiwiStore.sections).toHaveLength(1);
    });
    it("should have an action that gets the Views", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const getViewsSpy = vi.spyOn(mediakiwiStore, "getViews");

      // act
      await mediakiwiStore.getViews();

      // assert
      expect(getViewsSpy).toHaveBeenCalled();
      expect(mediakiwiStore.views).toHaveLength(1);
    });
    it("should have an action that gets the Roles", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const getRolesSpy = vi.spyOn(mediakiwiStore, "getRoles");

      // act
      await mediakiwiStore.getRoles();

      // assert
      expect(getRolesSpy).toHaveBeenCalled();
      expect(mediakiwiStore.roles).toHaveLength(1);
    });
    it("should have an action to initialize the store", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const getNavigationItemsSpy = vi.spyOn(mediakiwiStore, "getNavigationItems");
      const getSectionsSpy = vi.spyOn(mediakiwiStore, "getSections");
      const getViewsSpy = vi.spyOn(mediakiwiStore, "getViews");
      const getRolesSpy = vi.spyOn(mediakiwiStore, "getRoles");

      // act
      await mediakiwiStore.init();

      // assert
      expect(getNavigationItemsSpy).toHaveBeenCalled();
      expect(getViewsSpy).toHaveBeenCalled();
      expect(getRolesSpy).toHaveBeenCalled();
      expect(getSectionsSpy).toHaveBeenCalled();
    });
    it("should have an action to toggle the drawer", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const toggleDrawerSpy = vi.spyOn(mediakiwiStore, "toggleDrawer");
      expect(mediakiwiStore.drawer).toBe(true); // check on initial value

      // act
      mediakiwiStore.toggleDrawer();

      // assert
      expect(toggleDrawerSpy).toHaveBeenCalled();
      expect(mediakiwiStore.drawer).toBe(false);
    });
    it("should have an action to set the navigation items", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const setNavSpy = vi.spyOn(mediakiwiStore, "setNavigationItems");
      expect(mediakiwiStore.navigationItems).toHaveLength(0); // check on initial value

      // act
      mediakiwiStore.setNavigationItems(expectedChangeNavItems.data);

      // assert
      expect(mediakiwiStore.navigationItems).toHaveLength(6);
      expect(mediakiwiStore.navigationItems[0].id).toBe("2");
      expect(setNavSpy).toHaveBeenCalled();
    });
    it("should have an action to set the views", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const setViewsSpy = vi.spyOn(mediakiwiStore, "setViews");
      expect(mediakiwiStore.views).toHaveLength(0); // check on initial value

      // act
      mediakiwiStore.setViews(expectedChangeViews.data);

      // assert
      expect(mediakiwiStore.views).toHaveLength(6);
      expect(mediakiwiStore.views.some((x) => x.name === "Bikes Overview")).toBe(true);
      expect(setViewsSpy).toHaveBeenCalled();
    });
    it("should have an action to set the sections", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const setSectionsSpy = vi.spyOn(mediakiwiStore, "setSections");
      expect(mediakiwiStore.sections).toHaveLength(0); // check on initial value

      // act
      mediakiwiStore.setSections(expectedChangeSections.data);

      // assert
      expect(mediakiwiStore.sections).toHaveLength(4);
      expect(mediakiwiStore.sections.some((x) => x.name === "Bikes")).toBe(true);
      expect(setSectionsSpy).toHaveBeenCalled();
    })
    it("should have an action to set the roles", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const setRolesSpy = vi.spyOn(mediakiwiStore, "setRoles");
      expect(mediakiwiStore.roles).toHaveLength(0); // check on initial value

      // act
      mediakiwiStore.setRoles(expectedChangeRoles.data);

      // assert
      expect(mediakiwiStore.roles).toHaveLength(4);
      expect(setRolesSpy).toHaveBeenCalled();
      expect(mediakiwiStore.roles.find((x) => x.id === "99")).toBeDefined();
    });
    it("should have an action to get the parent name", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const item = expectedChangeNavItems.data.result[0];
      const parentName = mediakiwiStore.getParentName(item);

      // assert
      expect(parentName).toBe("Intl cars");
    });
    it("should have an action to get the parent path", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      mediakiwiStore.setSections(expectedChangeSections.data);
      const item = expectedChangeNavItems.data.result[0];
      const parentPath = mediakiwiStore.getParentPath(item);

      // assert
      expect(parentPath).toBe("/External/Intl%20cars");
    });
    it("should have an action to set the navigation items for views", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      mediakiwiStore.setViews(expectedChangeViews.data);
      // check if view is undefined
      let queryItem = expectedChangeNavItems.data.result[0];
      expect(queryItem.view).toBeUndefined();
      // act
      const navigationItems = expectedChangeNavItems.data.result;
      mediakiwiStore.setNavigationItemsView(navigationItems);
      queryItem = expectedChangeNavItems.data.result[0];

      // assert
      expect(queryItem.viewId).toBeDefined();
      expect(queryItem.view).toBeDefined();
      expect(navigationItems[0].view?.name).toBe("International Cars Overview");
    });
    it("should have an action to set the has item navigation", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const navigationItems = expectedChangeNavItems.data.result;
      // check if hasItemNavigation is undefined
      let queryItem = navigationItems.find((x: any) => x.name === "Intl cars")?.hasItemNavigation;
      expect(queryItem).toBeUndefined();
      // act
      mediakiwiStore.setHasItemNavigation(navigationItems);
      queryItem = navigationItems.find((x: any) => x.name === "Intl cars")?.hasItemNavigation;

      // assert
      expect(queryItem).toBe(true);
    });
    it("should have an action to register icons", async () => {
      // arrange
      const mediakiwiStore = useMediakiwiStore();
      const options = <VuetifyOptions>{
        icons: {
          iconfont: "mdi",
        },
      };
      expect(mediakiwiStore.externalIcons).toBe(false);
      const registerIconsSpy = vi.spyOn(mediakiwiStore, "registerIcons");

      // act
      mediakiwiStore.registerIcons(options);

      // assert
      expect(registerIconsSpy).toHaveBeenCalled();
      expect(mediakiwiStore.externalIcons).toBe(true);
    });
  });
});