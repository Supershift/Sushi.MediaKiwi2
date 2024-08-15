import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { ComputedRef, ModelRef, computed } from "vue";
import { useI18next } from "@/composables/useI18next";
import { useSnackbarStore } from "@/stores";
import { useNavigation } from "@/composables/useNavigation";
import { DeleteProps } from "@/models/form";
import { TResult } from "@/models/form/TResult";

export async function useFormDelete(
  /** Props determining the configuration and labels */
  props: ComputedRef<DeleteProps>,
  /** Model for the Valid state of the component */
  inProgress: ModelRef<boolean, string>,
  /** Model for the ErrorProblemDetails state of the component */
  errorProblemDetails: ModelRef<ErrorProblemDetails | null | undefined, string>
) {
  // Inject Dependencies
  const { defaultT } = await useI18next();
  const snackbar = useSnackbarStore();
  const navigation = useNavigation();

  // Delete button labels
  const deleteButtonLabel = computed(() => props.value.deleteButtonLabel || defaultT.value("Delete"));
  const deleteConfirmationTitle = computed(
    () => props.value.deleteConfirmationTitle || props.value.deleteButtonLabel || defaultT.value("DeleteConfirmTitle", "Delete this entry")
  );
  const deleteConfirmationBody = computed(
    () => props.value.deleteConfirmationBody || defaultT.value("DeleteConfirmBody", "Are you sure you want to delete this entry permanently?")
  );
  const deleteSuccessfulMessage = computed(
    () => props.value.deleteSuccessfullSnackbarMessage || defaultT.value("DeleteSuccessful", "Deleted successfully").toString()
  );
  const deleteFailedMessage = computed(() => props.value.deleteFailedSnackbarMessage || defaultT.value("DeleteFailed", "Failed to delete").toString());

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

    try {
      // Delete the data
      await props.value.onDelete(event);

      // Show a message that the delete was successful
      if (!props.value.hideDeleteSnackbar) {
        // Show a message that the delete was successful
        snackbar.showMessage(deleteSuccessfulMessage.value);
      }

      // Redirect to the parent if the flag is set
      if (props.value.redirectAfterDelete && navigation.currentNavigationItem.value?.parent) {
        // Redirect to the top list
        navigation.navigateToParent();
      }

      // Set the result
      result = TResult.success();
    } catch (error: ErrorProblemDetails | any) {
      // Set the error
      errorProblemDetails.value = error;

      // Show a message that the delete failed
      snackbar.showMessage(deleteFailedMessage.value);

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
