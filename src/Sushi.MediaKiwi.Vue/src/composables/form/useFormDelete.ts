import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { ComputedRef, ModelRef, Ref, computed } from "vue";
import { useI18next } from "@/composables/useI18next";
import { useSnackbarStore } from "@/stores";
import { useNavigation } from "@/composables/useNavigation";
import { DeleteProps } from "@/models/form";
import { TResult } from "@/models/form/TResult";
import { useErrorProblemDetails } from "../useErrorProblemDetails";
import { useFormMessages } from "./useFormMessages";

export async function useFormDelete(
  /** Props determining the configuration and labels */
  props: ComputedRef<DeleteProps>,
  /** Ref to the Form element */
  formRef: Ref<any>,
  /** Name of the entity that is being used in the form. Used in the snackbar feedback  */
  entitiyName: ComputedRef<string | undefined>,
  /** Model for the Valid state of the component */
  inProgress: ModelRef<boolean, string>,
  /** Model for the ErrorProblemDetails state of the component */
  errorProblemDetails: ModelRef<ErrorProblemDetails | null | undefined, string>
) {
  // Inject Dependencies
  const { defaultT, t } = await useI18next("FormDelete");
  const snackbar = useSnackbarStore();
  const navigation = useNavigation();
  const { toErrorProblemDetails } = useErrorProblemDetails();
  const formMessages = await useFormMessages();

  const entityLabel = computed(() => entitiyName.value || "entry");

  // Delete button labels
  const deleteButtonLabel = computed(() => props.value.deleteButtonLabel || formMessages.deleteButtonLabel());
  const deleteConfirmationTitle = computed(() => props.value.deleteConfirmationTitle || props.value.deleteButtonLabel || formMessages.deleteButtonLabel());
  const deleteConfirmationBody = computed(() => props.value.deleteConfirmationBody || formMessages.deleteConfirmationBody(entityLabel.value));
  const deleteSuccessfulMessage = computed(() => props.value.deleteSuccessfullSnackbarMessage || formMessages.deleteSuccessfulMessage(entityLabel.value));
  const deleteFailedMessage = computed(() => props.value.deleteFailedSnackbarMessage || formMessages.deleteFailedMessage(entityLabel.value));

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
    } catch (error: any) {
      let errorResult: ErrorProblemDetails;
      if (error instanceof ErrorProblemDetails) {
        errorResult = error as ErrorProblemDetails;
      } else {
        errorResult = await toErrorProblemDetails(error);
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
