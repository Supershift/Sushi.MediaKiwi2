import { MediakiwiVueOptions } from "@/models";
import { globalErrorHandler } from "@/errorHandler/globalErrorHandler";
import { App } from "vue";

/**
 * Register the global error handler for the application
 */
export function registerErrorHandler(app: App, options: MediakiwiVueOptions) {
  app.config.errorHandler = options.globalErrorHandler || globalErrorHandler;
}
