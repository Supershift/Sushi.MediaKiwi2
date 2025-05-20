import { ErrorProblemDetails } from "@/models";
import { ComponentPublicInstance } from "vue";
import { useSnackbarStore } from "@/stores";
import { useErrorProblemDetails } from "@/composables/useErrorProblemDetails";
import { createErrorProblemDetails } from "./createErrorProblemDetails";
import { error } from "console";

/**
 * Vue global error handler, can be overridden by the user
 * @param err The error that was thrown
 * @param instance Component instance where the error was thrown
 * @param info This is a Vue-specific error info, e.g. which lifecycle hook the error was thrown in
 * @returns
 */
export async function globalErrorHandler(err: any, instance?: ComponentPublicInstance | null, info?: string) {
  // Log the error to the console
  console.error(err, instance, info);

  // Check if we need to parse the error
  let errorProblemDetails: ErrorProblemDetails | undefined;
  if (err instanceof ErrorProblemDetails) {
    errorProblemDetails = err;
  } else {
    errorProblemDetails = await createErrorProblemDetails(err);
  }

  if (errorProblemDetails.silent) {
    // If the error is silent, we don't want to show it to the user
    return;
  }

  // If we have an instance, try to find the closest form, and set the error
  if (instance) {
    // find the closest form
    const mkForm = findParentMkForm(instance);

    // If we have a form, set the error on the form
    if (mkForm?.setError) {
      mkForm.setError(errorProblemDetails);
      // We set the error on the form, so we can leave
      return;
    }
  }

  // If we don't have a form, show a snackbar message
  setErrorSnackbar(errorProblemDetails);
}

/**
 * Set the error on the form or show a snackbar message
 */
export async function setErrorSnackbar(error: ErrorProblemDetails) {
  const { getErrorMessages } = await useErrorProblemDetails();
  const snackbar = useSnackbarStore();

  // define the messages
  const message = getErrorMessages(error)?.join(", ") ?? "";

  // Show a snackbar message to the user
  snackbar.showMessage(message);
}

/**
 * Find a parent MkForm, MkFormDialog or MkSideSheet component for the given instance
 * const vm = instance.$parent?.$parent?.$parent?.$parent?.$parent?.$parent?.$parent || (instance as any);
 */
export function findParentMkForm(instance: ComponentPublicInstance): any {
  let vm;

  if (instance?.$options?.__name === "MkForm" || instance?.$options?.__name === "MkFormDialog" || instance?.$options?.__name === "MkFormSideSheet") {
    vm = instance;
  } else if (instance.$parent) {
    vm = findParentMkForm(instance.$parent);
  }

  return vm;
}
