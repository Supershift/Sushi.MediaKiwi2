import { useAxiosExtensions } from "@/composables/useAxiosExtensions";
import { ApiError, ErrorProblemDetails } from "@/models";
import { isAxiosError } from "axios";
import { isApiError, isApiErrorArray, isError, IsErrorProblemDetails, isStringArray } from "./typeguards";
import { isNavigationFailure } from "vue-router";
import { container } from "tsyringe";
import { getRouterErrorMessage } from "./router";

/**
 * Parse the problem details from the error response
 */
export async function toErrorProblemDetails(error?: any) {
  // inject dependencies
  const { isAxiosBlobResponse } = useAxiosExtensions();

  // Create a result
  let result: ErrorProblemDetails | undefined;

  if (error) {
    if (isAxiosError(error) && error.response?.data) {
      // If the response is a blob and the type is json, parse the error problem details
      if (isAxiosBlobResponse(error)) {
        const responseText = await error.response.data.text();
        const errorResult = JSON.parse(responseText);
        result = errorResult as ErrorProblemDetails;
      } else if (IsErrorProblemDetails(error.response.data)) {
        // We got an object, so we can parse it to an error problem details object
        result = ErrorProblemDetails.fromResponse(error.response);
      }
    } else if (isNavigationFailure(error)) {
      // If we have a navigation failure, get the error message
      const message = await getRouterErrorMessage(error);
      result = new ErrorProblemDetails(message);
    } else if (isError(error)) {
      // If we have an error object, create a default error problem details object
      result = new ErrorProblemDetails(error?.message);
    }
  }

  // If we don't have a result, create a default error problem details object
  if (!result) {
    result = await ErrorProblemDetails.fromStatus(error?.response?.status);
  }

  return result;
}

/**
 * Get the problem detail messages
 */
export function getErrorMessages(errorProblemDetails?: ErrorProblemDetails | null): string[] | undefined {
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
export function getErrorMessageFromApiError(error: ApiError | ApiError[] | Record<string, string[]> | string[]): string[] {
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
