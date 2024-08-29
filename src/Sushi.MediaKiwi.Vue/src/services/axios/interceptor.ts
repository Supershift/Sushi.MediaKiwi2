import { toErrorProblemDetails } from "@/errorhandler/parser";
import { AxiosInstance } from "axios";

/**
 * Register an interceptor for the axios instance. This will handle the response and tries to parse them to an object {@link ErrorProblemDetails}
 */
export function registerInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: any) => {
      // Create the result object
      const errorProblemDetails = await toErrorProblemDetails(error);

      // Return the problem details
      return Promise.reject(errorProblemDetails);
    }
  );
}
