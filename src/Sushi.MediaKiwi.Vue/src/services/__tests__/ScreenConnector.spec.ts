import "reflect-metadata";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ScreenConnector } from "../ScreenConnector";
import axiosMock from "axios";
import IScreenResponse from "../../models/responses/IScreenResponse";
import ListResult from "../../models/api/ListResult";

// mock axios
vi.mock("axios");

describe("ScreenConnector", () => {
  afterEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });
  it("Should call get for screens", async () => {
    const expectedResult = { data: new ListResult<IScreenResponse>() };
    // mock axios getter to return expected result
    axiosMock.get = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new ScreenConnector(axiosMock);
    const result = await connector.GetScreens();

    // assert
    expect(axiosMock.get).toHaveBeenCalledOnce();
    expect(axiosMock.get).toHaveBeenCalledWith("/screens");
    expect(result).toBe(expectedResult.data);
  });
});
