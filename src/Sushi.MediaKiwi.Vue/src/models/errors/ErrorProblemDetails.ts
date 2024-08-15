import { AxiosResponse, HttpStatusCode } from "axios";
import { ApiError } from "./ApiError";

/**
 * Implements Sushi.MediaKiwi.Services.Model.ErrorProblemDetails
 */
export class ErrorProblemDetails extends Error {
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

  /**
   * Create an ErrorProblemDetails object from a response object
   * @param response
   * @returns
   */
  static fromResponse(response: AxiosResponse): ErrorProblemDetails {
    const result = new ErrorProblemDetails();

    if (response && response.data) {
      result.type = response.data.type;
      result.title = response.data.title;
      result.status = response.status || response.data.status;
      result.detail = response.data.detail;
      result.instance = response.data.instance;
      result.error = response.data.error;
      result.errors = response.data.errors;

      if (!result.error && !result.errors && result.detail) {
        result.error = <ApiError>{ message: result.detail };
      }
    }

    return result;
  }
}

export class UnknownProblemDetails extends ErrorProblemDetails {
  constructor(status?: number | HttpStatusCode) {
    switch (status) {
      case HttpStatusCode.NotFound:
        super("NotFound", "Not found", status, "The requested resource was not found.");
        break;
      case HttpStatusCode.BadRequest:
        super("BadRequest", "Bad request", status, "The request was invalid.");
        break;
      case HttpStatusCode.Unauthorized:
        super("Unauthorized", "Unauthorized", status, "You are not authorized to access this resource.");
        break;
      case HttpStatusCode.Forbidden:
        super("Forbidden", "Forbidden", status, "You are not allowed to access this resource.");
        break;
      case HttpStatusCode.InternalServerError:
        super("InternalServerError", "Internal server error", status, "An internal server error occurred. Please try again later.");
        break;
      default:
        super("Unknown", "Unknown error", status || 418, "An unknown error occurred. Please try again later.");
        break;
    }
  }
}
