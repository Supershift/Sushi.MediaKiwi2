import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { ComputedRef, ModelRef, Ref, computed } from "vue";
import { useSnackbarStore } from "@/stores";
import { DeleteProps } from "@/models/form/FormProps";
import { TResult } from "@/models/form/TResult";
import { useErrorProblemDetails } from "@/composables/useErrorProblemDetails";
import { FormMessages } from "@/models/form/FormMessages";

export async function useFormDelete(
  /** Props determining the configuration and labels */
  props: ComputedRef<DeleteProps>,
  /** Ref to the Form element */
  formRef: Ref<any>,
  /** Name of the entity that is being used in the form. Used in the snackbar feedback  */
  entryName: ComputedRef<string | undefined>,
  /** Model for the Valid state of the component */
  inProgress: ModelRef<boolean, string>,
  /** Model for the ErrorProblemDetails state of the component */
  errorProblemDetails: ModelRef<ErrorProblemDetails | null | undefined, string>,
  /** FormMessages */
  formMessages: FormMessages
) {
  // Inject Dependencies
  const snackbar = useSnackbarStore();
  const { createErrorProblemDetails } = await useErrorProblemDetails();

  const entryLabel = computed(() => entryName.value || "entry");

  // Delete button labels
  const deleteButtonLabel = computed(() => props.value.deleteButtonLabel || formMessages.deleteButtonLabel());
  const deleteConfirmationTitle = computed(() => props.value.deleteConfirmationTitle || formMessages.deleteConfirmationTitle(entryLabel.value));
  const deleteConfirmationBody = computed(() => props.value.deleteConfirmationBody || formMessages.deleteConfirmationBody(entryLabel.value));
  const deleteSuccessfulMessage = computed(() => props.value.deleteSuccessfullSnackbarMessage || formMessages.deleteSuccessfulMessage(entryLabel.value));
  const deleteFailedMessage = computed(() => props.value.deleteFailedSnackbarMessage || formMessages.deleteFailedMessage(entryLabel.value));

  // Computed
  const hasDeleteHandler = computed(() => (props.value.onDelete ? true : false));

  /**
   * Event to delete the data for the form
   * @param event
   * @returns
   */
  async function onDelete(event?: Event): Promise<TResult> {
    // Define the result
    let result: TResult = TResult.success();

    // Check if a handler is provided
    if (!props.value.onDelete) {
      console.error("No onDelete handler provided");
      return TResult.failure();
    }

    // Set the progress indicator
    inProgress.value = true;

    // Clear error
    errorProblemDetails.value = null;

    try {
      // Delete the data
      const eventResult = await props.value.onDelete(event);

      // Check if the result is a TResult and if it is a failure
      if (eventResult && eventResult instanceof TResult && !eventResult.isSuccess) {
        throw eventResult.error;
      }

      // Show a message that the delete was successful
      if (!props.value.hideDeleteSnackbar) {
        // Show a message that the delete was successful
        snackbar.showMessage(deleteSuccessfulMessage.value);
      }

      // Set the result
      result = TResult.success();
    } catch (error: any) {
      let errorResult: ErrorProblemDetails;
      if (error instanceof ErrorProblemDetails) {
        errorResult = error as ErrorProblemDetails;
      } else {
        errorResult = await createErrorProblemDetails(error);
      }

      // Show a message that the submit failed
      errorProblemDetails.value = errorResult;

      // Show a message that the delete failed
      snackbar.showMessage(deleteFailedMessage.value);

      if (formRef.value && formRef.value.reset) {
        formRef.value.reset();
      }

      // Set the result
      result = TResult.failure(error);
    } finally {
      // Set the progress indicator
      inProgress.value = false;
    }

    // Return
    return result;
  }

  return {
    onDelete,
    deleteButtonLabel,
    deleteConfirmationTitle,
    deleteConfirmationBody,
    hasDeleteHandler,
    deleteSuccessfulMessage,
    deleteFailedMessage,
  };
}
