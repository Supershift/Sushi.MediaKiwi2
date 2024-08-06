import Qs from "qs";
import { AxiosError, AxiosInstance, HttpStatusCode, isAxiosError } from "axios";
import { ProblemDetails } from "@/models/errors/ProblemDetails";
import { useProblemDetails } from "./useProblemDetails";

export function useAxiosExtensions() {
  const { parseProblemDetails } = useProblemDetails();
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
   * Add a problem details interceptor
   * This will handle the problem details response and return a problem details object
   * If the response is not a problem details, it will return a default problem details object
   * @param axiosInstance
   */
  function addProblemDetailsInterceptor(axiosInstance: AxiosInstance) {
    // We can handle the response globally in the store
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (isAxiosError(error)) {
          // Create the result object
          let problemDetails = await parseProblemDetails(error);

          // If we couldn't parse the problem details, create a default one
          if (!problemDetails) {
            problemDetails = <ProblemDetails>{
              type: "Unknown",
              title: "Unknown error",
              status: error?.response?.status || HttpStatusCode.InternalServerError,
              detail: "An unknown error occurred. Please try again later.",
            };
          }

          // Return the problem details
          return Promise.reject(problemDetails);
        } else {
          console.error("Unexpected error:", error);
          return Promise.reject(error);
        }
      }
    );
  }

  return {
    addParamSerializer,
    addProblemDetailsInterceptor,
  };
}
