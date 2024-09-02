import { MediakiwiVueOptions } from "@/models";
import { globalErrorHandler } from "@/errorHandler/globalErrorHandler";
import { App } from "vue";
import { useErrorMessages } from "@/composables/useErrorMessages";
import { useFormMessages } from "@/composables";
import { container } from "tsyringe";
import type { useI18next as useI18nextComposable } from "@/composables/useI18next";

/**
 * Register the global error handler for the application
 */
export function registerErrorHandler(app: App, options: MediakiwiVueOptions) {
  app.config.errorHandler = options.globalErrorHandler || globalErrorHandler;
}

/**
 * Register the default error and form messages for the application
 * @param errorMessagei18Next The i18next composable for the error messages
 * @param formMessagesi18Next The i18next composable for the form messages
 */
export async function registerErrorMessages(
  errorMessagei18Next: ReturnType<typeof useI18nextComposable>,
  formMessagesi18Next: ReturnType<typeof useI18nextComposable>
) {
  const errorMessages = await useErrorMessages(errorMessagei18Next);

  console.log(errorMessages);

  container.register("errorMessages", { useValue: errorMessages });

  const formMessages = await useFormMessages(formMessagesi18Next);
  container.register("formMessages", { useValue: formMessages });
}
