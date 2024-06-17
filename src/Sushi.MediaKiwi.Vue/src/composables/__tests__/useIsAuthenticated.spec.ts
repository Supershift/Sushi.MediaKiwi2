import "reflect-metadata"
import { describe, it, expect, vi } from 'vitest';
import { useIsAuthenticated } from '@/composables/useIsAuthenticated';

const hoisted = vi.hoisted(() => {
  return {
    useMsal: vi.fn().mockReturnValue({
      account: {
        value: { username: 'test@testmail.test' }
      }
    })
  };
});

//TODO: finish mocking this test
describe.skip('useIsAuthenticated', () => {
  it('returns true when user is authenticated', () => {
    const spyon = vi.spyOn(hoisted, 'useMsal').mockReturnValue({
      account: {
        value: { username: 'test@testmail.test' }
      }
    });
    const isAuthenticated = useIsAuthenticated();
    expect(isAuthenticated.value).toBe(true);
    expect(spyon).toHaveBeenCalled();
  });

  it('returns false when user is not authenticated', () => {
    // Mock the useMsal composable to simulate a non-authenticated user
    const spyon = vi.spyOn(hoisted, 'useMsal').mockReturnValue({
      account: {
        value: null
      }
    });

    const isAuthenticated = useIsAuthenticated();
    expect(isAuthenticated.value).toBe(false);
    expect(spyon).toHaveBeenCalled();

  });
});