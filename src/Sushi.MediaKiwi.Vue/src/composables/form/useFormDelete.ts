import { ProblemDetails } from "@/models/errors/ProblemDetails";
import { ComputedRef, ModelRef, computed } from "vue";
import { useI18next as useI18nextComposable } from "@/composables/useI18next";
import { useSnackbarStore } from "@/stores";
import { useNavigation } from "@/composables/useNavigation";
import { DeleteProps } from "@/models/form";
import { TResult } from "@/models/form/TResult";

export async function useFormDelete(
  useI18next: ReturnType<typeof useI18nextComposable>,
  props: ComputedRef<DeleteProps>,
  inProgress: ModelRef<boolean, string>,
  problemDetails: ModelRef<ProblemDetails | null | undefined, string>
) {
  // Inject Dependencies
  const { defaultT } = await useI18next;
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

  async function onDelete(event?: Event): Promise<TResult> {
    // Define the result
    let result: TResult = TResult.success();

    if (!props.value.onDelete) {
      console.error("No onDelete handler provided");
      return TResult.failure();
    }

    // Set the progress indicator
    inProgress.value = true;

    try {
      // Delete the data
      await props.value.onDelete(event);

      if (!props.value.hideDeleteSnackbar) {
        // Show a message that the delete was successful
        snackbar.showMessage(deleteSuccessfulMessage.value);
      }

      console.log(navigation);

      if (props.value.redirectAfterDelete && navigation.currentNavigationItem.value?.parent) {
        // Redirect to the top list
        console.log("should be here!");
        navigation.navigateToParent();
      }

      // Set the result
      result = TResult.success();
    } catch (error: ProblemDetails | any) {
      // Set the error
      problemDetails.value = error;

      // Show a message that the delete failed
      snackbar.showMessage(deleteFailedMessage.value);

      // Set the result
      result = TResult.failure(error);
    } finally {
      inProgress.value = false;
    }

    return result;
  }

  return {
    onDelete,
    // computed
    deleteButtonLabel,
    deleteConfirmationTitle,
    deleteConfirmationBody,
    hasDeleteHandler,
    deleteSuccessfulMessage,
    deleteFailedMessage,
  };
}
