import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useNavigation } from '@/composables/useNavigation';
import { createApp } from 'vue';
import { mockMediakiwiStore, mockRouteMeta, mockRoutes, mockNavigationItemsAsRoot } from '@/composables/__mocks__/navigation';

let routes: RouteRecordRaw[] = mockRoutes;

let router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp({});
app.use(router);
app.use(createPinia());
setActivePinia(createPinia());

describe('useNavigation', () => {
  beforeEach(() => {
    // Create a new Vue application and router instance for each test
    vi.clearAllMocks();
    // Mock the store
    vi.mock('@/stores', () => ({
      useMediakiwiStore: vi.fn(() => (mockMediakiwiStore)),
    }));
    // Mock current router navigationItem
    vi.mock('@/router', () => ({
      useRoute: vi.fn(() => (mockRouteMeta)),
      useRouter: vi.fn(() => router),
    }));
    // Mock the msal dependencies
    vi.mock('@/identity', () => ({
      identity: {
        msalInstance: {
          getActiveAccount: vi.fn().mockReturnValue({
            idTokenClaims: {
              roles: ['admin'],
            }
          })
        },
      }
    }));
  });
  describe('Variables', () => {
    it('currentNavigationItem should be defined', async () => {
      const { currentNavigationItem } = useNavigation();
      expect(currentNavigationItem.value).toBeDefined();
      expect(currentNavigationItem.value.name).toBe('Detail');
    });

    it('currentViewParameter should be defined', () => {
      const { currentViewParameter } = useNavigation();

      // Expect currentViewParameter to be 1 since we have a parameter in the current view
      expect(currentViewParameter.value).toBeDefined();
      expect(currentViewParameter.value).toEqual("1");
    });

    it('currentViewParameterNumber should be defined', () => {
      const { currentViewParameterNumber } = useNavigation();

      // Expect currentViewParameterNumber to be 1 since we have a parameter in the current view
      expect(currentViewParameterNumber.value).toBeDefined();
      expect(currentViewParameterNumber.value).toEqual(1);
    });


    it('currentViewParameter should be defined', () => {
      const { currentRouteParamId } = useNavigation();

      // Expect currentRouteParamId to be 1
      // This comes from the route whereas currentViewParameter comes from the view
      expect(currentRouteParamId.value).toBeDefined();
      expect(currentRouteParamId.value).toEqual("1");
    });

    it('currentNavigationItem should be defined', () => {
      const { currentNavigationItem } = useNavigation();

      // Expect the 'Admin Section' since our mock identity has the 'admin' role
      expect(currentNavigationItem.value).toBeDefined();
      expect(currentNavigationItem.value).toEqual(mockRouteMeta.meta.navigationItem);
    });

    it('should filter sections based on role access and navigation items presence', () => {
      const { currentSections } = useNavigation();

      // Expect the 'Admin Section' since our mock identity has the 'admin' role
      expect(currentSections.value.length).toEqual(2);      
    });
  });


  describe('Navigation', () => {
    it('should navigate to home', async () => {
      const { navigateToHome, currentNavigationItem } = useNavigation();
      const spyon = vi.spyOn(router, 'push').mockImplementationOnce(
        () => {
          currentNavigationItem.value.name = 'Home';
          return Promise.resolve();
        }
      );
      await navigateToHome(); // > HOME
      expect(spyon).toHaveBeenCalled();
      expect(currentNavigationItem.value).toBeDefined();
      expect(currentNavigationItem.value.name).toBe('Home');
    });

    it('should navigate to parent', async () => {
      const { navigateToParent } = useNavigation();
      const spyon = vi.spyOn(router, 'push').mockImplementationOnce(() => Promise.resolve());

      await navigateToParent(); // DETAILS > HOME
      expect(spyon).toHaveBeenCalled();
    });

    it('should fail to navigate to parent, when no parent found', async () => {
      const { navigateToParent } = useNavigation();

      await expect((async () => {
        await navigateToParent(); // HOME > undefined
      })()).rejects.toThrowError();
    });
  });


  describe('Methods', () => {    
    // determineCurrentRootItem
    it('should correctly determine the root item with item navigation and multiple children', () => {
      const { determineCurrentRoootItem } = useNavigation();

      const expected = "Home"; // The root item should be the expected result
      const result = determineCurrentRoootItem();
      

      expect(result?.name).toEqual(expected);
    });

    // determineCurrentRootItem
    it('should correctly determine if navigation item is active', () => {
      const { determineIfNavigationItemIsActive } = useNavigation();

      const result = determineIfNavigationItemIsActive(mockRouteMeta.meta.navigationItem);

      expect(result).toEqual(true);
    });

    it('should correctly determine if navigation item is inactive', () => {
      const { determineIfNavigationItemIsActive } = useNavigation();

      const result = determineIfNavigationItemIsActive(mockNavigationItemsAsRoot);

      expect(result).toEqual(false);
    });

    // determineIfSectionIsActive
    it('should correctly determine section is active', () => {
      const { determineIfSectionIsActive } = useNavigation();

      const result = determineIfSectionIsActive(mockMediakiwiStore.navigationTree.sections[0]);

      expect(result).toEqual(true);
    });
    it('should correctly determine section is inactive', () => {
      const { determineIfSectionIsActive } = useNavigation();

      const result = determineIfSectionIsActive(mockMediakiwiStore.navigationTree.sections[1]);

      expect(result).toEqual(false);
    });
    
    // getItemsBasedOnRoot
    it('should correctly get all items based on root', () => {
      const { getItemsBasedOnRoot } = useNavigation();

      const result = getItemsBasedOnRoot();

      expect(result).toBeDefined();
      if (result) {
        expect(result[0].id).toEqual("2");
      }
    });
  });

});