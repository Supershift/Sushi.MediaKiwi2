import { useErrorMessages } from "./useErrorMessages";
import { useFormMessages } from "./form";
import { container } from "tsyringe";
import { App } from "vue";
import { useI18next as useI18nextComposable } from "./useI18next";

export async function useErrorProblemDetails(
  errorMessagei18Next: ReturnType<typeof useI18nextComposable>,
  formMessagesi18Next: ReturnType<typeof useI18nextComposable>
) {
  const errorMessages = await useErrorMessages(errorMessagei18Next);
  container.register("errorMessages", { useValue: errorMessages });

  const formMessages = await useFormMessages(formMessagesi18Next);
  container.register("formMessages", { useValue: formMessages });

  // async function getRouterErrorMessage(t: ErrorTypes): Promise<string>;
  // async function getRouterErrorMessage(error: NavigationFailure | any): Promise<string>;
  // async function getRouterErrorMessage(error: NavigationFailure | ErrorTypes): Promise<string> {
  //   if (isNavigationFailure(error)) {
  //     if (error.type) {
  //       return getRouterErrorMessage(error.type);
  //     }
  //   } else {
  //     switch (error) {
  //       case 1:
  //         return routeCouldNotBeResolvedErrorMessage;
  //     }
  //   }
  //   return routerErrorMessage;
  // }
  // return {
  //   getRouterErrorMessage,
  // };
}
