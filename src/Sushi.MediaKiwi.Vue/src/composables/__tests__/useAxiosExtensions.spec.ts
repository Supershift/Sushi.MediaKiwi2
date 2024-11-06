import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { useAxiosExtensions } from "../useAxiosExtensions";
import axios, { HttpStatusCode } from "axios";
import Qs from "qs";

describe("useAxiosExtensions", async () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("addParamSerializer", async () => {

    it("Should serialize params", async () => {
      // Arrange
      const { addParamSerializer } = useAxiosExtensions();

      expect(axios.defaults?.paramsSerializer).toBeUndefined();

      const params = { productTypes: [1, 2] };
      const axiosInstance = axios.create({ baseURL: "" });

      const serializer: any = {
        serialize: (params: any) => {
          return Qs.stringify(params, { arrayFormat: "repeat" });
        },
      }

      // Act
      addParamSerializer(axiosInstance);
      const spyonGet = vi.spyOn(axios, "get").mockResolvedValue({ status: HttpStatusCode.Ok });
      const response = await axios.get("http://localhost", { params });

      // Assert
      expect(spyonGet).toHaveBeenCalledOnce();
      expect(spyonGet).toHaveBeenCalledWith("http://localhost", { params });
      expect(response.status).toBe(HttpStatusCode.Ok);

      // expect(serializer.serialize(params)).toEqual();
      expect(axiosInstance.defaults.paramsSerializer).toBeDefined();
      if (axiosInstance.defaults.paramsSerializer !== undefined) {
        // @ts-ignore cuz we know it exists
        expect(axiosInstance.defaults.paramsSerializer.serialize(params)).toEqual(serializer.serialize(params));
      }
    });
  });
});
