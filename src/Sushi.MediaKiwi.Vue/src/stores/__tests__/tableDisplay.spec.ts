import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTableDisplayStore } from '../tableDisplay';
import { testDisplayOptions } from '../__mocks__/tableDisplay';

// Mocking localStorage
vi.stubGlobal('localStorage', {
  getItem: vi.fn(),
  setItem: vi.fn(),
});

// Mocking useNavigation
vi.mock('@/composables', () => ({
  useNavigation: vi.fn(() => ({
    currentNavigationItem: { value: { view: { id: 'testView' } } },
  })),
}));

// Mocked displayoptions

describe('useTableDisplayStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Pinia state before each test
    setActivePinia(createPinia());
  });

  describe('variables', () => {
    it('should have displayOptionsKey', () => {
      const store = useTableDisplayStore();
      expect(store.displayOptionsKey).toBe('MkTableDisplayOptions_testView');
    });
    it('should have viewRef', () => {
      const store = useTableDisplayStore();
      expect(store.viewRef).toBe('testView');
    });
  });
  describe('actions', () => {
    it('sets and saves display options to localStorage', async () => {
      // arrange
      const store = useTableDisplayStore();

      // act
      const storageSpyOn = vi.spyOn(localStorage, 'setItem');
      await store.setDisplayOptions(testDisplayOptions);
      const expectedResult = ["MkTableDisplayOptions_testView", JSON.stringify(testDisplayOptions)];

      // assert
      expect(store.displayOptions).toEqual(testDisplayOptions);
      expect(storageSpyOn).toHaveBeenCalledWith(...expectedResult);
    });

    it('gets display options, defaulting when unset', () => {
      const store = useTableDisplayStore();
      expect(store.getDisplayOptions()).toEqual({});
    });

    it('fetches and updates display options from localStorage', async () => {
      // arrange
      localStorage.getItem = vi.fn().mockImplementation(() => JSON.stringify(testDisplayOptions));
      const store = useTableDisplayStore();
      const storageSpyOn = vi.spyOn(localStorage, 'getItem');

      // act
      await store.fetchDisplayOptions();

      // assert
      expect(store.displayOptions).toEqual(testDisplayOptions);
      expect(storageSpyOn).toHaveBeenCalled();
    });
  });
});