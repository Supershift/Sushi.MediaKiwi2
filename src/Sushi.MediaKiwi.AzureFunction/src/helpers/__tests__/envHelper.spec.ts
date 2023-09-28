import { vi, describe, it, expect } from "vitest";
import { getSection } from "../envHelper";

// Stub the environment variables
vi.stubEnv("SampleWeb.Test:SettingA", "value-a");
vi.stubEnv("SampleWeb.Test:SettingB", "value-b");
vi.stubEnv("MediaKiwi.UseFakes", "false");
vi.stubEnv("MediaKiwi.ApiBaseUrl", "https://mediakiwi-sample-api-dev.azurewebsites.net/mediakiwi/api");
vi.stubEnv("MediaKiwi.MsalConfig.auth.clientId", "0aa0aaaa-a00a-0a00-aa00-0000000aaa0a");
vi.stubEnv("MediaKiwi.MsalConfig.auth.authority", "https://login.microsoftonline.com/00a00a00-0aa0-000a-aa0a-0aaa0a00a0a0");
vi.stubEnv("MediaKiwi.MsalConfig.auth.redirectUri", "/loginRedirect");
vi.stubEnv("MediaKiwi.MsalConfig.auth.postLogoutRedirectUri", "/signIn");

describe("EnvHelper", () => {
  it("Should get MediaKiwi values", () => {
    const result = getSection("MediaKiwi");

    expect(result).not.toBeUndefined();
    expect(result).not.toHaveProperty("MediaKiwi.MsalConfig"); // Properties should be converted to the camelCase
    expect(result).toEqual({
      mediaKiwi: {
        useFakes: false,
        apiBaseUrl: "https://mediakiwi-sample-api-dev.azurewebsites.net/mediakiwi/api",
        msalConfig: {
          auth: {
            clientId: "0aa0aaaa-a00a-0a00-aa00-0000000aaa0a",
            authority: "https://login.microsoftonline.com/00a00a00-0aa0-000a-aa0a-0aaa0a00a0a0",
            redirectUri: "/loginRedirect",
            postLogoutRedirectUri: "/signIn",
          },
        },
      },
    });
  });
});
