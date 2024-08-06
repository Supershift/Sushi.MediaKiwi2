// import { computed } from "vue";

import { ProblemDetails } from "@/models/errors/ProblemDetails";
import { ModelRef, Ref, computed } from "vue";
import { useI18next as useI18nextComposable } from "./../useI18next";
import { useSnackbarStore } from "@/stores";
import { LoadProps, UndoProps } from "@/models/form";

export async function useFormLoad(
  useI18next: ReturnType<typeof useI18nextComposable>,
  formProps: () => LoadProps & UndoProps,
  inProgress: ModelRef<boolean, string>,
  problemDetails: ModelRef<ProblemDetails | null | undefined, string>,
  formRef: Ref<any>
) {
  // Inject Dependencies
  const { defaultT } = await useI18next;
  const snackbar = useSnackbarStore();

  // Reactive Model
  const props = computed(() => formProps());

  // Load Labels
  const loadFailedSnackbarMessage = computed(() => props.value.loadFailedSnackbarMessage || defaultT.value("LoadFailed", "Failed to load data").toString());

  // Undo Labels
  const undoSuccessSnackbarMessage = computed(() => props.value.undoSuccessSnackbarMessage || defaultT.value("UndoSuccessful", "Changes reverted").toString());
  const undoFailedSnackbarMessage = computed(
    () => props.value.undoFailedSnackbarMessage || defaultT.value("UndoFailed", "Failed to revert changes").toString()
  );

  const hasLoadHandler = computed(() => (props.value.onLoad ? true : false));
  const hasUndoHanlder = computed(() => !props.value.hideUndo && hasLoadHandler.value && hasLoadHandler.value);

  async function onLoad(event?: Event) {
    if (props.value.onLoad) {
      inProgress.value = true;

      try {
        // Load the data
        await props.value.onLoad(event);
      } catch (error: ProblemDetails | any) {
        // Set the error
        problemDetails.value = error;

        snackbar.showMessage(loadFailedSnackbarMessage.value);
      } finally {
        inProgress.value = false;
      }
    }
  }

  async function onUndo(event?: Event) {
    if (!props.value.onLoad) {
      throw new Error("No onLoad handler provided");
    }

    inProgress.value = true;

    try {
      await props.value.onLoad(event);

      // Show a message
      snackbar.showMessage(undoSuccessSnackbarMessage.value);

      // https://vuetifyjs.com/en/components/forms/#exposed-properties
      formRef.value?.resetValidation();
    } catch (error: ProblemDetails | any) {
      // Set the error
      problemDetails.value = error;

      // Show a message
      snackbar.showMessage(undoFailedSnackbarMessage.value);
    } finally {
      inProgress.value = false;
    }
  }

  return {
    // functions
    onLoad,
    onUndo,
    // computed
    hasLoadHandler,
    hasUndoHanlder,
    // labels
    loadFailedSnackbarMessage,
    undoSuccessSnackbarMessage,
  };
}
