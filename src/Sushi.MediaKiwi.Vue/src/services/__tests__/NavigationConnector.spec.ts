import "reflect-metadata";
import { describe, it, expect, vi, afterEach } from "vitest";
import { NavigationConnector } from "../NavigationConnector";
import axiosMock, { AxiosResponse, HttpStatusCode } from "axios";
import { NavigationItemDto, Paging, Sorting } from "./../../models/api";
import ListResult from "./../../models/api/ListResult";
import { SortDirection } from "../../models/enum/SortDirection";

// mock axios
vi.mock("axios");

describe("NavigationConnector", () => {
  afterEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });

  it("Should call GetNavigationItems with correct parameters", async () => {
    // Arrange
    const expectedResult = <AxiosResponse>{
      data: <ListResult<NavigationItemDto>>{
        result: [<NavigationItemDto>{ id: "1", name: "test", sectionId: "1" }],
        totalCount: 1,
        pageCount: 1,
      },
    };
    const paging = <Paging>{ pageIndex: 0, pageSize: 10 };
    const sorting = <Sorting<NavigationItemDto>>{ sortBy: "name", sortDirection: SortDirection.Asc };

    // mock axios getter to return expected result
    axiosMock.get = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new NavigationConnector(axiosMock);
    const result = await connector.GetNavigationItems("1", paging, sorting);

    // assert
    expect(axiosMock.get).toHaveBeenCalledOnce();
    expect(axiosMock.get).toHaveBeenCalledWith("/navigationitems", {
      params: {
        sectionId: "1",
        pageIndex: 0,
        pageSize: 10,
        sortBy: "name",
        sortDirection: "ASC",
      },
    });
    expect(result).toBe(expectedResult.data);
  });

  it("Should call GetNavigationItem with correct parameters", async () => {
    // Arrange
    const expectedResult = <AxiosResponse>{
      data: <NavigationItemDto>{
        id: "1",
        name: "test",
        sectionId: "1",
      },
    };

    // mock axios getter to return expected result
    axiosMock.get = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new NavigationConnector(axiosMock);
    const result = await connector.GetNavigationItem("1");

    // assert
    expect(axiosMock.get).toHaveBeenCalledOnce();
    expect(axiosMock.get).toHaveBeenCalledWith("/navigationitems/1");
    expect(result).toBe(expectedResult.data);
  });

  it("Should call CreateNavigationItem with correct parameters", async () => {
    // Arrange
    const expectedResult = <AxiosResponse>{
      data: <NavigationItemDto>{
        id: "1",
        name: "test",
        sectionId: "1",
      },
    };

    // mock axios getter to return expected result
    axiosMock.post = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new NavigationConnector(axiosMock);

    const request = <NavigationItemDto>{ id: "1", name: "test", sectionId: "1" };
    const result = await connector.CreateNavigationItem(request);

    // assert
    expect(axiosMock.post).toHaveBeenCalledOnce();
    expect(axiosMock.post).toHaveBeenCalledWith("/navigationitems/1", request);
    expect(result).toBe(expectedResult.data);
  });

  it("Should call UpdateNavigationItem with correct parameters", async () => {
    // Arrange
    const expectedResult = <AxiosResponse>{
      data: <NavigationItemDto>{
        id: "1",
        name: "test2",
        sectionId: "1",
      },
    };

    // mock axios getter to return expected result
    axiosMock.put = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new NavigationConnector(axiosMock);

    const request = <NavigationItemDto>{ id: "1", name: "test2", sectionId: "1" };
    const result = await connector.UpdateNavigationItem(request);

    // assert
    expect(axiosMock.put).toHaveBeenCalledOnce();
    expect(axiosMock.put).toHaveBeenCalledWith("/navigationitems/1", request);
    expect(result).toBe(expectedResult.data);
  });

  it("Should call DeleteNavigationItem with correct parameters", async () => {
    // Arrange
    const expectedResult = <AxiosResponse>{
      status: HttpStatusCode.Ok,
    };

    // mock axios getter to return expected result
    axiosMock.delete = vi.fn().mockResolvedValue(expectedResult);

    // create connector and call
    const connector = new NavigationConnector(axiosMock);
    const result = await connector.DeleteNavigationItem("1");

    // assert
    expect(axiosMock.delete).toHaveBeenCalledOnce();
    expect(axiosMock.delete).toHaveBeenCalledWith("/navigationitems/1");
    expect(result).toBe(expectedResult);
  });
});
