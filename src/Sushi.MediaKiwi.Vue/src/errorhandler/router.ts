import { container } from "tsyringe";
import { ErrorTypes, isNavigationFailure, NavigationFailure } from "vue-router";

export async function getRouterErrorMessage(t: ErrorTypes): Promise<string>;
export async function getRouterErrorMessage(error: NavigationFailure | any): Promise<string>;
export async function getRouterErrorMessage(error: NavigationFailure | ErrorTypes): Promise<string> {
  const errorMessages = container.resolve("errorMessages") as any;

  if (isNavigationFailure(error)) {
    if (error.type) {
      return getRouterErrorMessage(error.type);
    }
  } else {
    switch (error) {
      case 1:
        return errorMessages.routeCouldNotBeResolvedErrorMessage;
    }
  }
  return errorMessages.routerErrorMessage;
}
