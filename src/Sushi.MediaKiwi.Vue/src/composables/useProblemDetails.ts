import { ProblemDetails } from "@/models/errors/ProblemDetails";
import { AxiosError, HttpStatusCode } from "axios";
import { Error } from "@/models/errors/Error";

export function useProblemDetails() {
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
        problemDetails = <ProblemDetails>{
          type: "Unknown",
          title: "Unknown error",
          status: error?.response?.status || HttpStatusCode.InternalServerError,
          detail: "An unknown error occurred. Please try again later.",
          error: error.response.data,
        };
      } else {
        // If the problem details are already parsed, return them
        problemDetails = error.response.data as ProblemDetails;
      }
    }

    return problemDetails;
  }

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
  function isError(error?: Error | Error[] | Record<string, string[]>): error is Error {
    return (error as Error).message !== undefined;
  }

  /** Type guard for Error[] */
  function isErrorArray(error?: Error | Error[] | Record<string, string[]>): error is Error[] {
    return Array.isArray(error);
  }

  function parseError(error: Error | Error[] | Record<string, string[]>): string[] {
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
    parseProblemDetails,
    getProblemDetailMessages,
  };
}
