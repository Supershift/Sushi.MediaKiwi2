import { ErrorProblemDetails } from "../errors/ErrorProblemDetails";

/**
 * Represents a result to an operation, which either succeeds with an instance of <typeparamref name="TValue"/> or fails with an instance of {@link ErrorProblemDetails}
 */
export class TResult<TValue = void> {
  value?: TValue;
  error?: ErrorProblemDetails;
  isSuccess: boolean;

  /**
   * Initializes a new instance of the {@link TResult} class.
   * @param value The value of the result.
   * @param error The error of the result.
   */
  constructor(isSuccess: boolean, value?: TValue, error?: ErrorProblemDetails) {
    this.value = value;
    this.error = error;
    this.isSuccess = isSuccess;
  }

  /**
   * Creates a new {@link TResult} instance that represents a successful operation.
   * @param value
   * @returns
   */
  static success<TValue>(value?: TValue): TResult<TValue> {
    return new TResult(true, value);
  }

  /**
   * Creates a new {@link TResult} instance that represents a failed operation.
   * @param error
   * @returns
   */
  static failure(error?: string): TResult;
  static failure(error?: ErrorProblemDetails): TResult;
  static failure(error?: string | ErrorProblemDetails): TResult {
    if (typeof error === "string") {
      return new TResult(false, undefined, new ErrorProblemDetails(error));
    }

    return new TResult(false, undefined, error);
  }
}
