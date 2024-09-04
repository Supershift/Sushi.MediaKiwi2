import { AxiosInstance, AxiosInterceptorOptions, AxiosResponse } from "axios";
import { createErrorProblemDetails } from "@/errorHandler/createErrorProblemDetails";

/**
 * Register an interceptor for the axios instance. This will handle the response and tries to parse them to an object {@link ErrorProblemDetails}
 */
export async function addErrorHandler(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: any) => {
      // Create the result object
      const errorProblemDetails = await createErrorProblemDetails(error);

      // Return the problem details
      return Promise.reject(errorProblemDetails);
    }
  );
}
