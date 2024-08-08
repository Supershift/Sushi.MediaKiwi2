import { ApiError } from "./ApiError";

/**
 * Microsoft.AspNetCore.Mvc.ProblemDetails
 */
export class ProblemDetails extends Error {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  error?: ApiError | ApiError[] | Record<string, string[]>;
  errors?: ApiError | ApiError[] | Record<string, string[]>;

  constructor(type?: string, title?: string, status?: number, detail?: string) {
    super();

    this.type = type;
    this.title = title;
    this.status = status;
    this.detail = detail;

    if (detail) {
      this.error = <ApiError>{ message: detail };
    }
  }

  static fromResponse(response: any): ProblemDetails {
    let result = new ProblemDetails();

    if (response) {
      result.type = response.type;
      result.title = response.title;
      result.status = response.status;
      result.detail = response.detail;
      result.instance = response.instance;
      result.error = response.error;
      result.errors = response.errors;

      if (!result.error && !result.errors && result.detail) {
        result.error = <ApiError>{ message: result.detail };
      }
    }

    return result;
  }
}

export class UnknownProblemDetails extends ProblemDetails {
  constructor(status?: number) {
    super("Unknown", "Unknown error", status || 418, "An unknown error occurred. Please try again later.");
  }
}
