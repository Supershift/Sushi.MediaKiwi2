import "reflect-metadata";
import { describe, it, expect, vi, afterEach } from "vitest";
import { SectionConnector } from "../SectionConnector";
import axiosMock from "axios";
import ISectionResponse from "../../models/responses/ISectionResponse";
import ListResult from "../../models/api/ListResult";

// mock axios
vi.mock("axios");

describe("SectionConnector", () => {
  afterEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });
  it("Should call get for sections", async () => {
    const expectedResult = { data: new ListResult<ISectionResponse>() };
    // mock axios getter to return expected result
    axiosMock.get = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new SectionConnector(axiosMock);
    const result = await connector.GetSections();

    // assert
    expect(axiosMock.get).toHaveBeenCalledOnce();
    expect(axiosMock.get).toHaveBeenCalledWith("/sections");
    expect(result).toBe(expectedResult.data);
  });
});
