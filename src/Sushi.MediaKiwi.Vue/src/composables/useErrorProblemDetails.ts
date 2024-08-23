import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { AxiosInstance, isAxiosError } from "axios";
import { ComponentPublicInstance, type App } from "vue";
import { ApiError } from "@/models/errors/ApiError";
import { useSnackbarStore } from "@/stores";
import { useAxiosExtensions } from "./useAxiosExtensions";
import { useErrorMessages } from "./useErrorMessages";
import { ErrorTypes, isNavigationFailure, NavigationFailure } from "vue-router";

export function useErrorProblemDetails() {
  /** Type guard for Error */
  function isError(error?: Error | Error[] | string[]): error is Error {
    return (error as Error)?.message !== undefined && (error as Error)?.message !== null && (error as Error)?.message !== "";
  }

  /** Type guard for Api Error */
  function isApiError(error?: ApiError | ApiError[] | Record<string, string[]> | string[]): error is ApiError {
    return (error as ApiError)?.message !== undefined;
  }

  /** Type guard for Error[] */
  function isApiErrorArray(error?: ApiError | ApiError[] | Record<string, string[]> | string[]): error is ApiError[] {
    return Array.isArray(error) && error.length > 0 && (error as ApiError[])[0]?.message !== undefined;
  }

  /** Type guard for Error[] */
  function isStringArray(error?: ApiError | ApiError[] | Record<string, string[]> | string[]): error is string[] {
    return Array.isArray(error) && error.length > 0 && typeof (error as string[])[0] === "string";
  }

  /** Type guard for ErrorProblemDetails */
  function IsErrorProblemDetails(error?: any): error is ErrorProblemDetails {
    return (
      ((error as ErrorProblemDetails).detail !== undefined && (error as ErrorProblemDetails).detail !== null) ||
      ((error as ErrorProblemDetails).error !== undefined && (error as ErrorProblemDetails).error !== null)
    );
  }

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
   * Find a parent MkForm, MkFormDialog or MkSideSheet component for the given instance
   * const vm = instance.$parent?.$parent?.$parent?.$parent?.$parent?.$parent?.$parent || (instance as any);
   */
  function findParentMkForm(instance: ComponentPublicInstance): any {
    let vm;

    if (instance?.$options?.__name === "MkForm" || instance?.$options?.__name === "MkFormDialog" || instance?.$options?.__name === "MkFormSideSheet") {
      vm = instance;
    } else if (instance.$parent) {
      vm = findParentMkForm(instance.$parent);
    }

    return vm;
  }

  /**
   * Set the error on the form or show a snackbar message
   */
  async function setErrorSnackbar(error: ErrorProblemDetails) {
    // Inject dependencies
    const { unexpectedErrorMessage } = await useErrorMessages();
    const snackbar = useSnackbarStore();

    // define the messages
    let message = getErrorMessages(error)?.join(", ") || "";

    // If we don't have a message, set the default message
    if (!message) {
      message = unexpectedErrorMessage;
    }

    // Show a snackbar message to the user
    snackbar.showMessage(message);
  }

  /**
   * Vue global error handler, can be overridden by the user
   * @param err The error that was thrown
   * @param instance Component instance where the error was thrown
   * @param info This is a Vue-specific error info, e.g. which lifecycle hook the error was thrown in
   * @returns
   */
  async function globalErrorHandler(err: any, instance?: ComponentPublicInstance | null, info?: string) {
    // Log the error to the console
    console.error(err, instance, info);

    // Check if we need to parse the error
    let errorProblemDetails: ErrorProblemDetails | undefined;
    if (err instanceof ErrorProblemDetails) {
      errorProblemDetails = err;
    } else {
      errorProblemDetails = await toErrorProblemDetails(err);
    }

    // If we have an instance, try to find the closest form, and set the error
    if (instance) {
      // find the closest form
      const mkForm = findParentMkForm(instance);

      // If we have a form, set the error on the form
      if (mkForm && mkForm.setError) {
        mkForm.setError(errorProblemDetails);
        // We set the error on the form, so we can leave
        return;
      }
    }

    // If we don't have a form, show a snackbar message
    setErrorSnackbar(errorProblemDetails);
  }

  /**
   * Set the global error handler for the uncaught errors
   */
  function registerGlobalErrorHandler(app: App, customGlobalErrorHandler?: (err: unknown, instance: ComponentPublicInstance | null, info: string) => void) {
    app.config.errorHandler = customGlobalErrorHandler || globalErrorHandler;
  }

  /**
   * Parse the problem details from the error response
   */
  async function toErrorProblemDetails(error?: any) {
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
        result = new ErrorProblemDetails(undefined, undefined, undefined, message);
      } else if (isError(error)) {
        // If we have an error object, create a default error problem details object
        result = new ErrorProblemDetails(undefined, undefined, undefined, error?.message);
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

  async function getRouterErrorMessage(t: ErrorTypes): Promise<string>;
  async function getRouterErrorMessage(error: NavigationFailure | any): Promise<string>;
  async function getRouterErrorMessage(error: NavigationFailure | ErrorTypes): Promise<string> {
    const { routerErrorMessage, routeCouldNotBeResolvedErrorMessage } = await useErrorMessages();

    if (isNavigationFailure(error)) {
      if (error.type) {
        return getRouterErrorMessage(error.type);
      }
    } else {
      switch (error) {
        case 1:
          return routeCouldNotBeResolvedErrorMessage;
      }
    }

    return routerErrorMessage;
  }

  return {
    registerInterceptor,
    registerGlobalErrorHandler,
    toErrorProblemDetails,
    getErrorMessages,
    //
    globalErrorHandler,
    setErrorSnackbar,
    findParentMkForm,
    //
    getRouterErrorMessage,
  };
}
