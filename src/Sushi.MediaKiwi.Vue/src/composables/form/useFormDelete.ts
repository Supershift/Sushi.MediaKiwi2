// import { computed } from "vue";

import { ProblemDetails } from "@/models/errors/ProblemDetails";
import { ModelRef, computed } from "vue";
import { useI18next as useI18nextComposable } from "./../useI18next";
import { useSnackbarStore } from "@/stores";
import { useNavigation } from "./../useNavigation";
import { DeleteProps } from "@/models/form";

export async function useFormDelete(
  useI18next: ReturnType<typeof useI18nextComposable>,
  formProps: () => DeleteProps,
  inProgress: ModelRef<boolean, string>,
  problemDetails: ModelRef<ProblemDetails | null | undefined, string>
) {
  // Inject Dependencies
  const { defaultT } = await useI18next;
  const snackbar = useSnackbarStore();
  const navigation = useNavigation();

  // Reactive Model
  const props = computed(() => formProps());

  // Delete button label
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

  const hasDeleteHandler = computed(() => (props.value.onDelete ? true : false));

  async function onDelete(event?: Event) {
    if (!props.value.onDelete) {
      throw new Error("No onDelete handler provided");
    }
    inProgress.value = true;

    try {
      // Delete the data
      await props.value.onDelete(event);

      if (!props.value.hideDeleteSnackbar) {
        // Show a message that the delete was successful
        snackbar.showMessage(deleteSuccessfulMessage.value);
      }

      if (props.value.redirectAfterDelete && navigation.currentNavigationItem.value?.parent) {
        // Redirect to the top list
        navigation.navigateToParent();
      }
    } catch (error: ProblemDetails | any) {
      // Set the error
      problemDetails.value = error;

      // Show a message that the delete failed
      snackbar.showMessage(deleteFailedMessage.value);
    } finally {
      inProgress.value = false;
    }
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
