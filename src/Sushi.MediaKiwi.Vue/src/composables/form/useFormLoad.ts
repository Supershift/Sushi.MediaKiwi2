// import { computed } from "vue";

import { ProblemDetails } from "@/models/errors/ProblemDetails";
import { ComputedRef, ModelRef, Ref, computed, watch } from "vue";
import { useI18next as useI18nextComposable } from "./../useI18next";
import { useSnackbarStore } from "@/stores";
import { LoadProps, UndoProps } from "@/models/form";
import { TResult } from "@/models/form/TResult";

export async function useFormLoad(
  useI18next: ReturnType<typeof useI18nextComposable>,
  props: ComputedRef<LoadProps & UndoProps>,
  inProgress: ModelRef<boolean, string>,
  problemDetails: ModelRef<ProblemDetails | null | undefined, string>,
  formRef: Ref<any>
) {
  // Inject Dependencies
  const { defaultT } = await useI18next;
  const snackbar = useSnackbarStore();

  // Load Labels
  const loadFailedSnackbarMessage = computed(() => props.value.loadFailedSnackbarMessage || defaultT.value("LoadFailed", "Failed to load data").toString());

  // Undo Labels
  const undoSuccessSnackbarMessage = computed(() => props.value.undoSuccessSnackbarMessage || defaultT.value("UndoSuccessful", "Changes reverted").toString());
  const undoFailedSnackbarMessage = computed(
    () => props.value.undoFailedSnackbarMessage || defaultT.value("UndoFailed", "Failed to revert changes").toString()
  );
  const undoButtonLabel = computed(() => props.value.undoButtonLabel || defaultT.value("UndoChanges", "Undo changes"));

  const hasLoadHandler = computed(() => (props.value.onLoad ? true : false));
  const hasUndoHanlder = computed(() => !props.value.hideUndo && hasLoadHandler.value && hasLoadHandler.value);

  function validateOnLoad() {
    if (props.value.validateOnLoad && formRef.value && formRef.value.validate) {
      formRef.value.validate();
    }
  }

  async function onLoad(event?: Event): Promise<TResult> {
    let result: TResult = TResult.success();

    if (props.value.onLoad) {
      inProgress.value = true;

      try {
        // Load the data
        await props.value.onLoad(event);
        validateOnLoad();
      } catch (error: ProblemDetails | any) {
        // Set the error
        problemDetails.value = error;

        // Show a message
        snackbar.showMessage(loadFailedSnackbarMessage.value);

        // Set the result
        result = TResult.failure(error);
      } finally {
        inProgress.value = false;
      }
    } else {
      validateOnLoad();
    }

    return result;
  }

  async function onUndo(event?: Event): Promise<TResult> {
    if (!props.value.onLoad) {
      throw new Error("No onLoad handler provided");
    }

    let result: TResult = TResult.success();

    inProgress.value = true;

    try {
      await props.value.onLoad(event);

      // Show a message
      snackbar.showMessage(undoSuccessSnackbarMessage.value);

      if (formRef.value && formRef.value.resetValidation) {
        formRef.value.resetValidation();
      }

      // Set the result
      result = TResult.success();
    } catch (error: ProblemDetails | any) {
      // Set the error
      problemDetails.value = error;

      // Show a message
      snackbar.showMessage(undoFailedSnackbarMessage.value);

      // Set the result
      result = TResult.failure(error);
    } finally {
      inProgress.value = false;
    }

    return result;
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
    undoButtonLabel,
  };
}
