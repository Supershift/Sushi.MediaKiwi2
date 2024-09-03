import { ApiError, ErrorProblemDetails } from "@/models";

/** Type guard for Error */
export function isError(error?: Error | Error[] | string[]): error is Error {
  return (error as Error)?.message !== undefined && (error as Error)?.message !== null && (error as Error)?.message !== "";
}

/** Type guard for Api Error */
export function isApiError(error?: ApiError | ApiError[] | Record<string, string[]> | string[]): error is ApiError {
  return (error as ApiError)?.message !== undefined;
}

/** Type guard for Error[] */
export function isApiErrorArray(error?: ApiError | ApiError[] | Record<string, string[]> | string[]): error is ApiError[] {
  return Array.isArray(error) && error.length > 0 && (error as ApiError[])[0]?.message !== undefined;
}

/** Type guard for Error[] */
export function isStringArray(error?: ApiError | ApiError[] | Record<string, string[]> | string[]): error is string[] {
  return Array.isArray(error) && error.length > 0 && typeof (error as string[])[0] === "string";
}

/** Type guard for ErrorProblemDetails */
export function IsErrorProblemDetails(error?: any): error is ErrorProblemDetails {
  return (
    ((error as ErrorProblemDetails).detail !== undefined && (error as ErrorProblemDetails).detail !== null) ||
    ((error as ErrorProblemDetails).error !== undefined && (error as ErrorProblemDetails).error !== null)
  );
}
