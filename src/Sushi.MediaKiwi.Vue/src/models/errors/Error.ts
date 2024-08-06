export type Error = {
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
};
