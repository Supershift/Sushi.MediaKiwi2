import "reflect-metadata";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { NavigationConnector } from "../NavigationConnector";
import axiosMock from "axios";
import { INavigationResponse } from "@/models/responses";
import ListResult from "@/models/api/ListResult";

// mock axios
vi.mock("axios");

describe("NavigationConnector", () => {
  afterEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });
  it("Should call get for navigationItems", async () => {
    const expectedResult = { data: new ListResult<INavigationResponse>() };
    // mock axios getter to return expected result
    axiosMock.get = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new NavigationConnector(axiosMock);
    const result = await connector.GetNavigationItems();

    // assert
    expect(axiosMock.get).toHaveBeenCalled();
    expect(result).toBe(expectedResult.data);
  });
});
