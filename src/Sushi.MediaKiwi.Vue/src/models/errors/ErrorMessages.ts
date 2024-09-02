export type ErrorMessages = {
  // Default error messages
  unexpectedErrorMessage: string;
  notFoundErrorMessage: string;
  badRequestErrorMessage: string;
  unauthorizedErrorMessage: string;
  forbiddenErrorMessage: string;
  internalServerErrorErrorMessage: string;
  routerErrorMessage: string;
  routeCouldNotBeResolvedErrorMessage: string;
  requiredMessage: string;

  // Validation error messages
  minLengthMessage: (minLength: string | number) => string;
  maxLengthMessage: (maxLength: string | number) => string;
  minMaxLengthMessage: (minLength: string | number, maxLength: string | number) => string;
  numericMessage: string;
  emailMessage: string;
  urlMessage: string;
  alphaNumericMessage: string;
  fileSizeExceedsLimitMessage: (fileLength: number) => string;
  fileTypeNotSupportedMessage: string;
  outOfRangeMessage: (minValue: string | number, maxValue: string | number) => string;
  greaterThanMessage: (minValue: string | number) => string;
  lessThanMessage: (maxValue: string | number) => string;
  uniqueMessage: string;
};
