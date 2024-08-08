import { ProblemDetails, UnknownProblemDetails } from "@/models/errors/ProblemDetails";
import { AxiosError, AxiosInstance, isAxiosError } from "axios";
import { ApiError } from "@/models/errors/ApiError";

export function useProblemDetails() {
  /**
   * Add a problem details interceptor
   * This will handle the problem details response and return a problem details object
   * If the response is not a problem details, it will return a default problem details object
   * @param axiosInstance
   */
  function registerProblemDetailsInterceptor(axiosInstance: AxiosInstance) {
    // We can handle the response globally in the store
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: any) => {
        if (isAxiosError(error)) {
          // Create the result object
          const problemDetails = await parseProblemDetails(error);

          // Return the problem details
          return Promise.reject(problemDetails);
        } else {
          console.error("Unexpected error:", error);
          return Promise.reject(new UnknownProblemDetails(error?.status));
        }
      }
    );
  }

  /**
   * Parse the problem details from the error response
   * @param error
   * @returns
   */
  async function parseProblemDetails(error?: ProblemDetails | any) {
    let problemDetails: ProblemDetails | undefined;

    // Check if any problem details were provided
    if (error?.response?.data) {
      // If the response is a blob and the type is json, parse the problem details
      if (isBlobResponse(error)) {
        const responseText = await error.response.data.text();
        const errorResult = JSON.parse(responseText);
        problemDetails = errorResult as ProblemDetails;
      } else if (typeof error?.response?.data === "string") {
        // We go a string as a response, so we can't use the result as is, so we'll create a problem details object
        problemDetails = problemDetails = new UnknownProblemDetails(error?.response?.status);
      } else {
        // If the problem details are already parsed, return them
        problemDetails = ProblemDetails.fromResponse(error.response.data);
      }
    }

    if (!problemDetails) {
      problemDetails = new UnknownProblemDetails(error?.response?.status);
    }

    return problemDetails;
  }

  /**
   * Check if the response is a blob response
   * @param error
   * @returns
   */
  function isBlobResponse(error?: AxiosError): boolean {
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

  /** Type guard for Error */
  function isError(error?: ApiError | ApiError[] | Record<string, string[]>): error is ApiError {
    return (error as ApiError).message !== undefined;
  }

  /** Type guard for Error[] */
  function isErrorArray(error?: ApiError | ApiError[] | Record<string, string[]>): error is ApiError[] {
    return Array.isArray(error);
  }

  /**
   * Parse the error object to a string array
   * @param error
   * @returns
   */
  function parseError(error: ApiError | ApiError[] | Record<string, string[]>): string[] {
    if (!error) {
      return [];
    }

    if (isErrorArray(error)) {
      return Array.from(error).flatMap((error) => `${error.message}`);
    } else if (isError(error)) {
      return [error.message];
    } else {
      return Object.values(error)?.flatMap((errors) => errors);
    }
  }

  /**
   * Get the problem detail messages
   * @param problemDetails
   * @param showDetails
   * @returns
   */
  function getProblemDetailMessages(problemDetails?: ProblemDetails | null, showDetails?: boolean): string[] | undefined {
    if (!problemDetails) {
      return;
    }

    if (showDetails && problemDetails?.detail) {
      return [problemDetails?.detail];
    }

    if (problemDetails.error) {
      return parseError(problemDetails?.error);
    } else if (problemDetails.errors) {
      return parseError(problemDetails?.errors);
    }
  }

  return {
    registerProblemDetailsInterceptor,
    parseProblemDetails,
    getProblemDetailMessages,
  };
}
