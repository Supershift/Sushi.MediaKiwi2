export type ApiError = {
  /**
   * The field that the error is related to.
   */
  field?: string;

  /**
   * First level of error indication, e.g. ValidationError, AggregateError, etc.
   */
  errorType: string;

  /**
   * Optionally defines a second level of error indication, e.g. MaximumLengthValidator for ValdationErrors, etc.
   */
  errorCode?: string;

  /**
   * A human-readable message describing the error.
   */
  message: string;

  /**
   * Collection of errors when the its an AggregateError.
   */
  errors?: ApiError[] | string[];
};
