import "reflect-metadata";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ConfigurationConnector } from "../ConfigurationConnector";
import { Configuration } from "../../models/Configuration";

// mock env variables
vi.stubEnv("MediaKiwi.ApiBaseUrl", "https://mediakiwi-sample-api-dev.azurewebsites.net/mediakiwi/api");
vi.stubEnv("MediaKiwi.identity.scopes", "api://testId/access_via_approle_assignments, api://testId/user_access");

describe("ConfigurationConnector", () => {
  afterEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });
  it("Should call get for configuration", async () => {
    const expectedResult: Configuration = {
      mediaKiwi: {
        apiBaseUrl: "https://mediakiwi-sample-api-dev.azurewebsites.net/mediakiwi/api",
        identity: {
          scopes: ["api://testId/access_via_approle_assignments", "api://testId/user_access"],
        },
      },
    };

    // create connector and call
    const connector = new ConfigurationConnector();
    const result = await connector.Get();

    // assert
    expect(result).toEqual(expectedResult);
  });
});
