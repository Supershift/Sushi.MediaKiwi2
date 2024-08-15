import { ErrorProblemDetails, UnknownProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { AxiosInstance, isAxiosError } from "axios";
import { ComponentPublicInstance, type App } from "vue";
import { ApiError } from "@/models/errors/ApiError";
import { useSnackbarStore } from "@/stores";
import { useI18next } from "./useI18next";
import { useAxiosExtensions } from "./useAxiosExtensions";

export function useErrorProblemDetails() {
  /**
   * Register an interceptor for the axios instance. This will handle the response and tries to parse them to an object {@link ErrorProblemDetails}
   */
  function registerInterceptor(axiosInstance: AxiosInstance) {
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

  /**
   * Vue global error handler, can be overridden by the user
   * @param err The error that was thrown
   * @param instance Component instance where the error was thrown
   * @param info This is a Vue-specific error info, e.g. which lifecycle hook the error was thrown in
   * @returns
   */
  async function globalErrorHandler(err: any, instance: ComponentPublicInstance | null, info: string) {
    // Inject dependencies
    const { defaultT } = await useI18next();
    const snackbar = useSnackbarStore();

    // Log the error to the console
    console.error(err, instance, info);

    // Get the default error message
    let message = defaultT.value("UnexpectedError", "An unexpected error occurred. Please try again later.");

    // Check if the error has a message put by the ErrorProblemDetails
    if (err?.error?.message) {
      message = err.error.message;
    }

    // Show a snackbar message to the user
    snackbar.showMessage(message);
  }

  /**
   * Set the global error handler for the uncaught errors
   * @param app
   * @param customGlobalErrorHandler
   */
  function registerGlobalErrorHandler(app: App, customGlobalErrorHandler?: (err: unknown, instance: ComponentPublicInstance | null, info: string) => void) {
    app.config.errorHandler = customGlobalErrorHandler || globalErrorHandler;
  }

  /**
   * Parse the problem details from the error response
   * @param error
   * @returns
   */
  async function toErrorProblemDetails(error?: any) {
    // inject dependencies
    const { isAxiosBlobResponse } = useAxiosExtensions();

    // Create a result
    let result: ErrorProblemDetails | undefined;

    // Check if the error is an Axios error
    if (isAxiosError(error) && error?.response?.data) {
      // If the response is a blob and the type is json, parse the error problem details
      if (isAxiosBlobResponse(error)) {
        const responseText = await error.response.data.text();
        const errorResult = JSON.parse(responseText);
        result = errorResult as ErrorProblemDetails;
      } else if (typeof error?.response?.data === "string") {
        // We go a string as a response, so we can't use the result as is, so we'll create a error problem details object
        result = new UnknownProblemDetails(error?.response?.status);
      } else {
        // We got an object, so we can parse it to an error problem details object
        result = ErrorProblemDetails.fromResponse(error.response);
      }
    }

    // If we don't have a result, create a default error problem details object
    if (!result) {
      result = new UnknownProblemDetails(error?.response?.status);
    }

    return result;
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
   * Get the problem detail messages
   * @param errorProblemDetails
   * @param showDetails
   * @returns
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
      result = getErrorMessageFromApiError(errorProblemDetails.error);
    } else if (errorProblemDetails.errors) {
      result = getErrorMessageFromApiError(errorProblemDetails.errors);
    } else if (errorProblemDetails.detail) {
      // If we have a detail and nothing else, return the detail
      result = [errorProblemDetails?.detail];
    }

    return result;
  }

  /**
   * Parse the error object to a string array
   */
  function getErrorMessageFromApiError(error: ApiError | ApiError[] | Record<string, string[]>): string[] {
    // If we don't have an error, return an empty array
    if (!error) {
      return [];
    }

    if (isErrorArray(error)) {
      // Check if we have an array of errors
      // Flatten the array and return the messages
      return Array.from(error).flatMap((error) => `${error.message}`);
    } else if (isError(error)) {
      // If we have a single error, return the message as an array
      return [error.message];
    } else {
      // If we have an object with string arrays, return the values
      return Object.values(error)?.flatMap((errors) => errors);
    }
  }

  return {
    registerInterceptor,
    registerGlobalErrorHandler,
    toErrorProblemDetails,
    getErrorMessages,
  };
}
