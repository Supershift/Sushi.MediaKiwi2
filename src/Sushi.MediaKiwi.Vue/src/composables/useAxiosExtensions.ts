import Qs from "qs";
import { AxiosError, AxiosInstance } from "axios";

export function useAxiosExtensions() {
  /**
   * Add the params serializer
   * Dotnet expects the array elements to be serialized in a repeat format (e.g. productTypes=1&productTypes=2)
   * By default, axios serializes the array elements in a bracket format (e.g. productTypes[]=1&productTypes[]=2)
   */
  function addParamSerializer(axiosInstance: AxiosInstance) {
    axiosInstance.defaults.paramsSerializer = {
      serialize: (params: any) => {
        return Qs.stringify(params, { arrayFormat: "repeat" });
      },
    };
  }

  /**
   * Check if the response is a blob response
   * @param error
   * @returns
   */
  function isAxiosBlobResponse(error?: AxiosError): boolean {
    if (!error) return false;

    if (
      error.request?.responseType === "blob" &&
      error.response?.data instanceof Blob &&
      error.response.data?.type &&
      error.response.data?.type.toLowerCase().indexOf("json") != -1
    ) {
      return true;
    }

    return false;
  }

  return {
    addParamSerializer,
    isAxiosBlobResponse,
  };
}
