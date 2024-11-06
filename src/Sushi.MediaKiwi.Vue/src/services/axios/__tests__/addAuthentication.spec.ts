import { describe, it, expect, vi } from 'vitest';
import { addAuthentication } from '../addAuthentication';
import { identity } from '@/identity';
import { InternalAxiosRequestConfig } from 'axios';

// Mock the identity module
vi.mock('@/identity', () => ({
  identity: {
    msalInstance: {
      getActiveAccount: vi.fn().mockReturnValue({
        idTokenClaims: {
          roles: ['admin'],
        }
      })
    },
  },
  getAccessToken: vi.fn().mockResolvedValue('test-token'),
}));
describe('addAuthentication', () => {
  it('should add Authorization header if accessToken is present', async () => {
    const accessToken = 'test-token';
    identity.getAccessToken = vi.fn().mockResolvedValue(accessToken);
    const config = {
      headers: {},
    } as InternalAxiosRequestConfig;
    const expectedConfig = {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    };

    const result = await addAuthentication(config);
    expect(result).toEqual(expectedConfig);
  });

  it('should warn and not modify config if no accessToken is present', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
    identity.getAccessToken = vi.fn().mockResolvedValue(null);
    const config = {
      headers: {},
    } as InternalAxiosRequestConfig;
    const expectedConfig = {
      headers: {},
    };

    const result = await addAuthentication(config);
    expect(result).toEqual(expectedConfig);
    expect(consoleWarnSpy).toHaveBeenCalledWith('no active account found');
    consoleWarnSpy.mockRestore();
  });
});