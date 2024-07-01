import "reflect-metadata";
import { describe, it, expect } from 'vitest';
import { useMediakiwiVueOptions } from '@/composables/useMediakiwiVueOptions';
import { inject } from "vue";


// Mock the entire Vue module
vi.mock('vue', () => {
  const originalVue = vi.importActual('vue'); // Import the actual Vue functions
  return {
    ...originalVue, // Spread the original module
    inject: vi.fn(), // Mock the inject function
  };
});
describe('useMediakiwiVueOptions', () => {
  it('returns default options when no options are provided', () => {
    // Arrange
    // Define the key and value you expect to be used with inject
    const expectedInjectionKey = 'mediakiwi';

    // Act
    useMediakiwiVueOptions();

    // Assert
    expect(inject).toHaveBeenCalledWith(expectedInjectionKey);
  });

});