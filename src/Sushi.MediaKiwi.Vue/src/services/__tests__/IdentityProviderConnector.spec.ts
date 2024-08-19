// Import statements for testing
import 'reflect-metadata'
import { describe, it, expect, vi } from 'vitest';
import { IdentityProviderConnector } from '../IdentityProviderConnector';
import { EntraSettings } from '@/models';
import mockAxios from 'axios';


// Create an instance of the class with the mocked Axios
const connector = new IdentityProviderConnector(mockAxios);

describe('IdentityProviderConnector', () => {
  it('should retrieve EntraSettings correctly', async () => {
    // Mock data to be returned by the Axios get call
    const mockEntraSettings: EntraSettings = {
      clientId: "client-id",
      tenantId: "tenant-id",
      instance: "https://login.microsoftonline.com/",
      authority: "https://login.microsoftonline.com/tenant-id",
    };

    // Setup the mock to resolve with mock data
    mockAxios.get = vi.fn().mockResolvedValue({ data: mockEntraSettings });

    // Call the method
    const result = await connector.GetEntraSettings();

    // Assertions
    expect(mockAxios.get).toHaveBeenCalledWith('/identityprovider/entra');
    expect(result).toEqual(mockEntraSettings);
  });
});