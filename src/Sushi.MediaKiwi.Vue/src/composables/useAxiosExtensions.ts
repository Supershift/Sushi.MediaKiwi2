import Qs from "qs";
import { AxiosInstance } from "axios";

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

  return {
    addParamSerializer,
  };
}
