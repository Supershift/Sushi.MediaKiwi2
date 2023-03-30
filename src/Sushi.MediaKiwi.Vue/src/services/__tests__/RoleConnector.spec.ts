import "reflect-metadata";
import { describe, it, expect, vi, afterEach } from "vitest";
import { RoleConnector } from "../RoleConnector";
import axiosMock from "axios";
import { Role } from "../../models/";
import ListResult from "../../models/api/ListResult";

// mock axios
vi.mock("axios");

describe("RoleConnector", () => {
  afterEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });
  it("Should call get for Roles", async () => {
    const expectedResult = { data: new ListResult<Role>() };
    // mock axios getter to return expected result
    axiosMock.get = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new RoleConnector(axiosMock);
    const result = await connector.GetRoles();

    // assert
    expect(axiosMock.get).toHaveBeenCalledOnce();
    expect(axiosMock.get).toHaveBeenCalledWith("/roles");
    expect(result).toBe(expectedResult.data);
  });
});
