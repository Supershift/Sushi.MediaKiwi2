import { ApiError, ErrorProblemDetails } from "@/models";
import { isApiError, isApiErrorArray, isStringArray } from "@/errorHandler/typeguards";

export async function useErrorProblemDetails() {
  /**
   * Get the problem detail messages
   */
  function getErrorMessages(errorProblemDetails?: ErrorProblemDetails | null): string[] | undefined {
    // If we don't have an error, return undefined
    if (!errorProblemDetails) {
      return;
    }

    // Create a result array
    let result: string[] = [];

    // Check if we have an error or errors object
    if (errorProblemDetails.error) {
      if (errorProblemDetails.error.errors && errorProblemDetails.error.errors.length) {
        result = getErrorMessageFromApiError(errorProblemDetails.error.errors);
      } else {
        result = getErrorMessageFromApiError(errorProblemDetails.error);
      }
    } else if (errorProblemDetails.detail) {
      // If we have a detail and nothing else, return the detail
      result = [errorProblemDetails?.detail];
    }

    return result;
  }

  /**
   * Parse the error object to a string array
   */
  function getErrorMessageFromApiError(error: ApiError | ApiError[] | Record<string, string[]> | string[]): string[] {
    // If we don't have an error, return an empty array
    if (!error) {
      return [];
    }

    if (isStringArray(error)) {
      // If we have an array of strings, return the array
      return error;
    } else if (isApiErrorArray(error)) {
      // Check if we have an array of errors
      // Flatten the array and return the messages
      return Array.from(error).flatMap((error) => `${error.message}`);
    } else if (isApiError(error)) {
      // If we have a single error, return the message as an array
      return [error.message];
    } else {
      // If we have an object with string arrays, return the values
      return Object.values(error)?.flatMap((errors) => errors);
    }
  }

  return {
    getErrorMessages,
    getErrorMessageFromApiError,
  };
}
