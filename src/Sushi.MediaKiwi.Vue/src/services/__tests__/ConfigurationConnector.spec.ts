// Import statements
import { describe, it, expect, vi } from 'vitest';
import { ConfigurationConnector } from '../ConfigurationConnector';
import axiosMock from 'axios';

// Mock axios
vi.mock('axios');

describe('ConfigurationConnector', () => {
  it('should correctly fetch data using GetAsync', async () => {
    // Setup
    const mockData = { key: 'value' }; // Mock response data
    axiosMock.get = vi.fn().mockResolvedValue({ data: mockData }); // Mock axios.get to resolve with mockData
    const connector = new ConfigurationConnector('/test-path', 'http://test-base-url');

    // Act
    const result = await connector.GetAsync();

    // Assert
    expect(axiosMock.get).toHaveBeenCalledWith('http://test-base-url/test-path'); // Check if axios.get was called with correct URL
    expect(result).toEqual(mockData); // Check if the method returns the mock data
  });
});