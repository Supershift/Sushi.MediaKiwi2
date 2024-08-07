import { ProblemDetails } from "../errors/ProblemDetails";

/**
 * Represents a result to an operation, which either succeeds with an instance of <typeparamref name="TValue"/> or fails with an instance of {@link ProblemDetails}
 */
export class TResult<TValue = void> {
  value?: TValue;
  error?: ProblemDetails;
  isSuccess: boolean;

  /**
   * Initializes a new instance of the {@link TResult} class.
   * @param value The value of the result.
   * @param error The error of the result.
   */
  constructor(isSuccess: boolean, value?: TValue, error?: ProblemDetails) {
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
  static failure(error?: ProblemDetails): TResult {
    return new TResult(false, undefined, error);
  }
}
