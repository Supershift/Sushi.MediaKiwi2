import { describe, it, expect } from "vitest";
import { formatKey, getTypedValue, getValues, mergeDeep, parseToNestedObject } from "../logic";

describe("Logic", () => {
  it("Should parse string to boolean", () => {
    const value = "true";
    const result = getTypedValue(value);

    expect(result);
    expect(typeof result).toBe("boolean");
  });

  it("Should parse string to number", () => {
    const value = "100";
    const result = getTypedValue(value);
    expect(result);
    expect(typeof result).toBe("number");
  });

  it("Should parse empty string to undefined", () => {
    const value = "";
    const result = getTypedValue(value);
    expect(result).toBe(undefined);
  });

  it("Should format key to camelCase", () => {
    const value = "MediaKiwi";
    const result = formatKey(value);
    expect(result).toMatch("mediaKiwi");
  });

  it("Should parse nested object", () => {
    // set the keys
    const key = "MediaKiwi.msalConfig.auth.redirectUri";
    const value = "/loginRedirect";

    const result = parseToNestedObject(key, value);

    expect(result).not.toBeUndefined();
    expect(result).toEqual({
      mediaKiwi: {
        msalConfig: {
          auth: {
            redirectUri: "/loginRedirect",
          },
        },
      },
    });
  });

  it("Should handle wrong nested object", () => {
    // set the keys
    const key = "MediaKiwi..msalConfig.auth.redirectUri";
    const value = "/loginRedirect";

    const result = parseToNestedObject(key, value);

    expect(result).not.toBeUndefined();
    expect(result).toEqual({
      mediaKiwi: {
        msalConfig: {
          auth: {
            redirectUri: "/loginRedirect",
          },
        },
      },
    });
  });

  it("Should merge two nested objects", () => {
    const objectA = parseToNestedObject("MediaKiwi.msalConfig.auth.redirectUri", "/loginRedirect");
    const objectB = parseToNestedObject("MediaKiwi.msalConfig.clientId", "testId");

    const result = mergeDeep(objectA, objectB);

    expect(result).not.toBeUndefined();
    expect(result).toEqual({
      mediaKiwi: {
        msalConfig: {
          auth: {
            redirectUri: "/loginRedirect",
          },
          clientId: "testId",
        },
      },
    });
  });

  it("Should merge two nested objects when one is undefined", () => {
    const object = parseToNestedObject("MediaKiwi.msalConfig.auth.redirectUri", "/loginRedirect");

    const result = mergeDeep(object, undefined);

    expect(result).not.toBeUndefined();
    expect(result).toEqual({
      mediaKiwi: {
        msalConfig: {
          auth: {
            redirectUri: "/loginRedirect",
          },
        },
      },
    });
  });

  it("Should get MediaKiwi values", () => {
    const appSettings = {
      "SampleWeb.Test:SettingA": "value-a",
      "SampleWeb.Test:SettingB": "value-b",
      "MediaKiwi.UseFakes": "false",
      "MediaKiwi.ApiBaseUrl": "https://mediakiwi-sample-api-dev.azurewebsites.net/mediakiwi/api",
      "MediaKiwi.MsalConfig.auth.clientId": "0aa0aaaa-a00a-0a00-aa00-0000000aaa0a",
      "MediaKiwi.MsalConfig.auth.authority": "https://login.microsoftonline.com/00a00a00-0aa0-000a-aa0a-0aaa0a00a0a0",
      "MediaKiwi.MsalConfig.auth.redirectUri": "/loginRedirect",
      "MediaKiwi.MsalConfig.auth.postLogoutRedirectUri": "/signIn",
    };

    const result = getValues("MediaKiwi", appSettings);

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
