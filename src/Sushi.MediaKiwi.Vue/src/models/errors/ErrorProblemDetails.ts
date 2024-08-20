import { AxiosResponse, HttpStatusCode } from "axios";
import { ApiError } from "./ApiError";
import { useErrorMessages } from "@/composables/useErrorMessages";

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

      if (!result.error && result.detail) {
        result.error = <ApiError>{ message: result.detail };
      }
    }

    return result;
  }

  static async fromStatus(status?: number | HttpStatusCode): Promise<ErrorProblemDetails> {
    const errorMessages = await useErrorMessages();

    switch (status) {
      case HttpStatusCode.NotFound:
        return new ErrorProblemDetails("NotFound", "Not found", status, errorMessages.notFoundErrorMessage);
      case HttpStatusCode.BadRequest:
        return new ErrorProblemDetails("BadRequest", "Bad request", status, errorMessages.badRequestErrorMessage);
      case HttpStatusCode.Unauthorized:
        return new ErrorProblemDetails("Unauthorized", "Unauthorized", status, errorMessages.unauthorizedErrorMessage);
      case HttpStatusCode.Forbidden:
        return new ErrorProblemDetails("Forbidden", "Forbidden", status, errorMessages.forbiddenErrorMessage);
      case HttpStatusCode.InternalServerError:
        return new ErrorProblemDetails("InternalServerError", "Internal server error", status, errorMessages.internalServerErrorErrorMessage);
      default:
        return new ErrorProblemDetails("Unknown", "Unknown error", status || 418, errorMessages.unexpectedErrorMessage);
    }
  }
}
