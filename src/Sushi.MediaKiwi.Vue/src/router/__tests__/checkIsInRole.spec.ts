import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkIsInRole } from "../checkIsInRole";
import { Configuration, PublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { RouteLocationNormalized } from "vue-router";
import { identity } from "../../identity";

// mock libraries
vi.mock("@azure/msal-browser");

// default stubs
function generateRouteLocation(): RouteLocationNormalized {
  return { path: "", name: "", matched: [], fullPath: "", query: {}, hash: "", redirectedFrom: undefined, params: {}, meta: {} };
}
function generateAccountInfo(): AccountInfo {
  return { homeAccountId: "", environment: "", tenantId: "", username: "", localAccountId: "" };
}

// mock window alert, which currently is called by checkIsInRole
window.alert = vi.fn();

describe("RouteGenerator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Should pass if roles empty", () => {
    // arrange
    const from = generateRouteLocation();
    const to = generateRouteLocation();
    to.meta.requiresRole = [];
    // act
    const result = checkIsInRole(to, from);

    // assert
    expect(result).true;
  });
  it("Should pass if roles undefined", () => {
    // arrange
    const from = generateRouteLocation();
    const to = generateRouteLocation();
    to.meta.requiresRole = undefined;
    // act
    const result = checkIsInRole(to, from);

    // assert
    expect(result).true;
  });
  it("Should pass if role on user", () => {
    // arrange
    const from = generateRouteLocation();
    const to = generateRouteLocation();
    to.meta.requiresRole = ["Admin"];
    const config: Configuration = { auth: { clientId: "" } };
    identity.msalInstance = new PublicClientApplication(config);
    const account: AccountInfo = generateAccountInfo();
    account.idTokenClaims = { roles: ["Admin"] };
    identity.msalInstance.getActiveAccount = vi.fn(() => account);
    console.log(identity.msalInstance);

    // act
    const result = checkIsInRole(to, from);

    // assert
    expect(result).true;
  });
});
