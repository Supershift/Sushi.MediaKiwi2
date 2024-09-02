import { AxiosInstance } from "axios";
import { useErrorProblemDetails } from "@/composables/useErrorProblemDetails";

// inject dependencies
const { createErrorProblemDetails } = await useErrorProblemDetails();

/**
 * Register an interceptor for the axios instance. This will handle the response and tries to parse them to an object {@link ErrorProblemDetails}
 */
export async function registerInterceptor(axiosInstance: AxiosInstance) {
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
