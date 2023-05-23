import "reflect-metadata";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ViewConnector } from "../ViewConnector";
import axiosMock from "axios";
import { View } from "../../models/api";
import ListResult from "../../models/api/ListResult";

// mock axios
vi.mock("axios");

describe("ScreenConnector", () => {
  afterEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });
  it("Should call get for screens", async () => {
    const expectedResult = { data: new ListResult<View>() };
    // mock axios getter to return expected result
    axiosMock.get = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new ViewConnector(axiosMock);
    const result = await connector.GetViews();

    // assert
    expect(axiosMock.get).toHaveBeenCalledOnce();
    expect(axiosMock.get).toHaveBeenCalledWith("/views", { params: {} });
    expect(result).toBe(expectedResult.data);
  });
});
