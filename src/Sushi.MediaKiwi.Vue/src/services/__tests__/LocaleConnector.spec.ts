import "reflect-metadata";
import { describe, it, expect, vi, afterEach } from "vitest";
import { LocaleConnector } from "../LocaleConnector";
import axiosMock from "axios";
import { Locale } from "../../models/";
import ListResult from "../../models/api/ListResult";

// mock axios
vi.mock("axios");

describe("LocaleConnector", () => {
  afterEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });
  it("Should call get for Locales", async () => {
    const expectedResult = { data: new ListResult<Locale>() };
    // mock axios getter to return expected result
    axiosMock.get = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new LocaleConnector(axiosMock);
    const result = await connector.GetAll(true);

    // assert
    expect(axiosMock.get).toHaveBeenCalledOnce();
    expect(axiosMock.get).toHaveBeenCalledWith("/locales", { params: { onlyEnabled: true } });
    expect(result).toBe(expectedResult.data);
  });

  it("Should call get for EnabledLocales", async () => {
    const expectedResult = { data: new ListResult<Locale>() };
    // mock axios getter to return expected result
    axiosMock.get = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new LocaleConnector(axiosMock);
    const result = await connector.GetEnabledLocales();

    // assert
    expect(axiosMock.get).toHaveBeenCalledOnce();
    expect(axiosMock.get).toHaveBeenCalledWith("/locales/enabled");
    expect(result).toBe(expectedResult.data);
  });
});
