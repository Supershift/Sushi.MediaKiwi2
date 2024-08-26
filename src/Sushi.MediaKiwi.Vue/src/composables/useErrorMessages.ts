import { useI18next } from "./useI18next";

export async function useErrorMessages() {
  const { t } = await useI18next("ErrorMessages");

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

  return {
    unexpectedErrorMessage,
    notFoundErrorMessage,
    badRequestErrorMessage,
    unauthorizedErrorMessage,
    forbiddenErrorMessage,
    internalServerErrorErrorMessage,
    routerErrorMessage,
    routeCouldNotBeResolvedErrorMessage,
  };
}
