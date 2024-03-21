import "reflect-metadata";
import { describe, it, expect, vi, afterEach } from "vitest";
import { HotelConnector } from "../HotelConnector";
import axiosMock from "axios";
import { ListResult } from "@/models";
import { Hotel } from "./../../models/Hotel";

// mock axios
vi.mock("axios");

describe("HotelConnector", () => {
  afterEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });
  it("Should call get for Hotels", async () => {
    const expectedResult = { data: new ListResult<Hotel>() };
    // mock axios getter to return expected result
    axiosMock.get = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new HotelConnector(axiosMock);
    const result = await connector.GetAllAsync();

    // assert
    expect(axiosMock.get).toHaveBeenCalledWith("/hotels", { params: {} });
    expect(result).toBe(expectedResult.data);
  });

  it("Should call get for Hotel", async () => {
    const expectedResult = { data: new ListResult<Hotel>() };
    // mock axios getter to return expected result
    axiosMock.get = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new HotelConnector(axiosMock);
    const result = await connector.GetAsync(1);

    // assert
    expect(axiosMock.get).toHaveBeenCalledWith("/hotels/1");
    expect(result).toBe(expectedResult.data);
  });
});
