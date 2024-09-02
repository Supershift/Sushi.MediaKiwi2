import { AxiosResponse, HttpStatusCode } from "axios";
import { ApiError } from "./ApiError";
import { useErrorMessages } from "@/composables/useErrorMessages";
import { container } from "tsyringe";
import { ErrorMessages } from "./ErrorMessages";

/**
 * Implements Sushi.MediaKiwi.Services.Model.ErrorProblemDetails
 */
export class ErrorProblemDetails extends Error {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  error?: ApiError | Record<string, string[]>;

  constructor(detail?: string, type?: string, title?: string, status?: number) {
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

      if (!result.error && result.detail) {
        result.error = <ApiError>{ message: result.detail };
      }
    }

    return result;
  }

  static async fromStatus(status?: number | HttpStatusCode): Promise<ErrorProblemDetails> {
    // Inject dependencies, FIX
    const errorMessages = container.resolve("errorMessages") as ErrorMessages;

    switch (status) {
      case HttpStatusCode.NotFound:
        return new ErrorProblemDetails(errorMessages.notFoundErrorMessage, "NotFound", "Not found", status);
      case HttpStatusCode.BadRequest:
        return new ErrorProblemDetails(errorMessages.badRequestErrorMessage, "BadRequest", "Bad request", status);
      case HttpStatusCode.Unauthorized:
        return new ErrorProblemDetails(errorMessages.unauthorizedErrorMessage, "Unauthorized", "Unauthorized", status);
      case HttpStatusCode.Forbidden:
        return new ErrorProblemDetails(errorMessages.forbiddenErrorMessage, "Forbidden", "Forbidden", status);
      case HttpStatusCode.InternalServerError:
        return new ErrorProblemDetails(errorMessages.internalServerErrorErrorMessage, "InternalServerError", "Internal server error", status);
      default:
        return new ErrorProblemDetails(errorMessages.unexpectedErrorMessage, "Unknown", "Unknown error", status || 418);
    }
  }
}
