import { AxiosError, HttpStatusCode } from "axios";
import { ErrorProblemDetails } from "@/models";
import { isAxiosError } from "axios";
import { isError, IsErrorProblemDetails } from "@/errorHandler/typeguards";
import { isNavigationFailure } from "vue-router";

/**
 * Create an error problem details object from the error
 */
export async function createErrorProblemDetails(error?: any) {
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
      } else if (typeof error.response.data === "string" && error.response.status !== HttpStatusCode.InternalServerError) {
        // If we have a response with a status code, create a new error problem details object
        result = new ErrorProblemDetails(error.response.data, "UnknownError", "UnknownError", error.response.status);
      }
      else if (error.response.data.title == "One or more validation errors occurred.") {
        const validationErrorsList = Object.entries(error.response.data.errors);
        const validationErrorsString = validationErrorsList.map(([key, value]) => `${key}: ${value}`).toString();
        result = new ErrorProblemDetails(`One or more validation errors occurred. ${validationErrorsString}`, "ValidationError", "ValidationError", error.response.status);
      }
    } else if (isNavigationFailure(error)) {
      // If we have a navigation failure, get the error message
      result = new ErrorProblemDetails(error.message, "NavigationFailure");
    } else if (isError(error)) {
      // If we have an error object, create a default error problem details object
      result = new ErrorProblemDetails(error?.message);
    }
  }

  // If we don't have a result, return an empty problem details object
  if (!result) {
    return new ErrorProblemDetails();
  }

  return result;
}

/**
 * Check if the response is a blob response
 * @param error
 * @returns
 */
function isAxiosBlobResponse(error?: AxiosError): boolean {
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
