import { AxiosInstance, isAxiosError } from "axios";
import { createErrorProblemDetails } from "@/errorHandler/createErrorProblemDetails";
import { ErrorProblemDetails } from "@/models";

/**
 * Register an interceptor for the axios instance. This will handle the response and tries to parse them to an object {@link ErrorProblemDetails}
 */
export async function registerInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: any) => {
      if (isAxiosError(error) && error.config?.signal?.aborted) {
        let reason = "Request aborted";

        // Check if the request was aborted
        if (error.config.signal instanceof AbortSignal) {
          reason = error.config.signal.reason ?? reason;
        }

        const abortError = new ErrorProblemDetails(reason, "RequestAborted", "RequestAborted");
        abortError.silent = true; // Set silent to true to prevent showing the error
        return Promise.reject(abortError);
      }

      // Create the result object
      const errorProblemDetails = await createErrorProblemDetails(error);

      // Return the problem details
      return Promise.reject(errorProblemDetails);
    }
  );
}
