import { ErrorMessages } from "@/models/errors/ErrorMessages";
import { useI18next as useI18nextComposable } from "./useI18next";

export async function useErrorMessages(useI18next: ReturnType<typeof useI18nextComposable>): Promise<ErrorMessages> {
  const { formatBytes, t } = await useI18next;

  // Default error messages
  const unexpectedErrorMessage = t.value("UnexpectedError", "An unexpected error occurred. Please try again later.").toString();
  const notFoundErrorMessage = t.value("NotFound", "The requested resource was not found.").toString();
  const badRequestErrorMessage = t.value("BadRequest", "The request was invalid.").toString();
  const unauthorizedErrorMessage = t.value("Unauthorized", "You are not authorized to access this resource.").toString();
  const forbiddenErrorMessage = t.value("Forbidden", "You are not allowed to access this resource.").toString();
  const internalServerErrorErrorMessage = t.value("InternalServerError", "An internal server error occurred. Please try again later.").toString();

  // Router errors
  const routerErrorMessage = t.value("RouterError", "An error occurred while navigating to the requested route.").toString();
  const routeCouldNotBeResolvedErrorMessage = t.value("RouteCouldNotBeResolved", "The route could not be resolved.").toString();

  // Validation error messages
  const requiredMessage = t.value("RequiredField", "This field is required.");
  const minLengthMessage = (minLength: string | number) => t.value("MinLength", "The input must be more than {{min}} characters long.", { min: minLength });
  const maxLengthMessage = (maxLength: string | number) => t.value("MaxLength", "The input must be at least {{max}} characters long.", { max: maxLength });
  const minMaxLengthMessage = (minLength: string | number, maxLength: string | number) =>
    t.value("minMaxLength", "The input must be between {{min}} and {{max}} characters long.", { min: minLength, max: maxLength });
  const numericMessage = t.value("Numeric", "Enter a valid numeric value.");
  const emailMessage = t.value("Email", "Enter a valid email address.");
  const urlMessage = t.value("Url", "Enter a valid URL.");
  const alphaNumericMessage = t.value("AlphaNumeric", "The input contains unsupported characters. Please remove any special characters and/or symbols.");
  const fileSizeExceedsLimitMessage = (fileLength: number) =>
    t.value("FileSizeExceedsLimit", "The size of the selected file exceeds the limit of {{limit}}.", { limit: formatBytes.value(fileLength) });
  const fileTypeNotSupportedMessage = t.value("fileTypeNotSupported", "The selected file type is not supported.");

  const outOfRangeMessage = (minValue: string | number, maxValue: string | number) =>
    t.value("OutOfRange", "The value must be between {{min}} and {{max}}.", { min: minValue, max: maxValue });
  const greaterThanMessage = (minValue: string | number) => t.value("GreaterThan", "The value must be greater than {{min}}.", { min: minValue });
  const lessThanMessage = (maxValue: string | number) => t.value("LessThan", "The value must be less than {{max}}.", { max: maxValue });

  const uniqueMessage = t.value("Unique", "The value must be unique.");

  return {
    unexpectedErrorMessage,
    notFoundErrorMessage,
    badRequestErrorMessage,
    unauthorizedErrorMessage,
    forbiddenErrorMessage,
    internalServerErrorErrorMessage,
    routerErrorMessage,
    routeCouldNotBeResolvedErrorMessage,
    requiredMessage,
    minLengthMessage,
    maxLengthMessage,
    minMaxLengthMessage,
    numericMessage,
    emailMessage,
    alphaNumericMessage,
    fileSizeExceedsLimitMessage,
    fileTypeNotSupportedMessage,
    urlMessage,
    outOfRangeMessage,
    greaterThanMessage,
    lessThanMessage,
    uniqueMessage,
  };
}
