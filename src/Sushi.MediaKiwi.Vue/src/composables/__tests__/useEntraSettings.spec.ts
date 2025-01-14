import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEntraSettings } from '../useEntraSettings';
import { MediakiwiVueOptions } from '@/models';

vi.mock('@/services/axios/createAxiosClient', () => ({
  createPublicAxiosClient: vi.fn(),
}));
vi.mock('@/services/api', () => {
  return {
    Api: vi.fn().mockImplementation(() => {
      return {
        mediakiwi: {
          identityproviderEntra: vi.fn().mockResolvedValue({
            data: {
              instance: "https://login.microsoftonline.com/",
              tenantId: "tenant-id",
              clientId: "client-id"
            }
          }),
        },
      };
    }),
  };
});

describe('useEntraSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getEntraSettings returns the correct settings', async () => {
    const { getEntraSettings } = useEntraSettings('');

    const settings = await getEntraSettings();

    expect(settings.authority).toBe('https://login.microsoftonline.com/tenant-id');
  });

  it('fillEntraSettings fills the options correctly', async () => {
    const { fillEntraSettings } = useEntraSettings('');
    const options = await fillEntraSettings({ apiBaseUrl: "" } as MediakiwiVueOptions);

    expect(options.msalConfig.auth.clientId).toBe("client-id");
    expect(options.msalConfig.auth.authority).toContain('https://login.microsoftonline.com');
    expect(options.identity.scopes).toEqual(['api://client-id/access_via_approle_assignments']);
  });
});