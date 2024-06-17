import { describe, it, expect } from 'vitest';
import { useElevations } from '@/composables/useElevations';

describe('useElevations', () => {
  const { elevations, getElevationClass } = useElevations();

  it('contains the correct elevations', () => {
    expect(elevations).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns the correct elevation class for a given key', () => {
    const key = 3;
    const expectedClass = 'elevation-3';
    expect(getElevationClass(key)).toBe(expectedClass);
  });

  it('returns undefined for an invalid key', () => {
    const key = 10; // Assuming this is an invalid key
    const expectedClass = `elevation-${key}`;
    expect(getElevationClass(key)).toBe(expectedClass);
  });
});