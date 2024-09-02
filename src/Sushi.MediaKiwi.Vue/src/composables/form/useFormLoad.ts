import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { ComputedRef, ModelRef, Ref, computed } from "vue";
import { useSnackbarStore } from "@/stores";
import { LoadProps, UndoProps } from "@/models/form/FormProps";
import { TResult } from "@/models/form/TResult";
import { container } from "tsyringe";
import { useErrorProblemDetails } from "@/composables/useErrorProblemDetails";
import { FormMessages } from "@/models/form/FormMessages";

export async function useFormLoad(
  /** Props determining the configuration and labels */
  props: ComputedRef<LoadProps & UndoProps>,
  /** Ref to the Form element */
  formRef: Ref<any>,
  /** Name of the entity that is being used in the form. Used in the snackbar feedback  */
  entryName: ComputedRef<string | undefined>,
  /** Model for the Progress state of the component */
  inProgress: ModelRef<boolean, string>,
  /** Model for the ErrorProblemDetails state of the component */
  errorProblemDetails: ModelRef<ErrorProblemDetails | null | undefined, string>,
  /** Model for the Progress state of the component */
  isLoaded: Ref<boolean>
) {
  // Inject Dependencies
  const snackbar = useSnackbarStore();
  const { toErrorProblemDetails } = useErrorProblemDetails();

  const formMessages = container.resolve("formMessages") as FormMessages;

  const entryLabel = computed(() => entryName.value || "data");

  // Load Labels
  const loadFailedSnackbarMessage = computed(() => props.value.loadFailedSnackbarMessage || formMessages.loadFailedSnackbarMessage(entryLabel.value));

  // Undo Labels
  const undoButtonLabel = computed(() => props.value.undoButtonLabel || formMessages.undoButtonLabel());
  const undoSuccessSnackbarMessage = computed(() => props.value.undoSuccessSnackbarMessage || formMessages.undoSuccessSnackbarMessage());
  const undoFailedSnackbarMessage = computed(() => props.value.undoFailedSnackbarMessage || formMessages.undoFailedSnackbarMessage());

  // Computed properties for the handlers
  const hasLoadHandler = computed(() => (props.value.onLoad ? true : false));
  const hasUndoHandler = computed(() => !props.value.hideUndo && (props.value.onUndo || hasLoadHandler.value));

  const isUndoDisabled = computed(() => inProgress.value);

  /**
   * Validates the form on load if the {@link LoadProps.validateOnLoad} flag is set
   */
  function validateOnLoad() {
    if (props.value.validateOnLoad && formRef.value && formRef.value.validate) {
      formRef.value.validate();
    }
  }

  /**
   * Event to load the data for the form
   */
  async function onLoad(event?: Event): Promise<TResult> {
    // Define the result
    let result: TResult = TResult.success();

    if (!hasLoadHandler.value) {
      // Set the loaded flag
      isLoaded.value = true;
    }

    // Check if a handler is provided
    if (props.value.onLoad) {
      // Set the progress indicator
      inProgress.value = true;

      // Clear error
      errorProblemDetails.value = null;

      try {
        // Load the data
        const eventResult = await props.value.onLoad(event);

        // Check if the result is a TResult and if it is a failure
        if (eventResult && eventResult instanceof TResult && !eventResult.isSuccess) {
          throw eventResult.error;
        }
      } catch (error: any) {
        let errorResult: ErrorProblemDetails;
        if (error instanceof ErrorProblemDetails) {
          errorResult = error as ErrorProblemDetails;
        } else {
          errorResult = await toErrorProblemDetails(error);
        }

        // Show a message that the submit failed
        errorProblemDetails.value = errorResult;

        // Show a message
        snackbar.showMessage(loadFailedSnackbarMessage.value);

        // Set the result
        result = TResult.failure(error);
      } finally {
        // Set the progress indicator
        inProgress.value = false;

        // Set the loaded flag
        isLoaded.value = true;
      }
    }

    // validate the form if the flag is set
    validateOnLoad();

    // Return the result
    return result;
  }

  /**
   * Event to undo the changes made to the form
   */
  async function onUndo(event?: Event): Promise<TResult> {
    if (!hasLoadHandler.value && !hasUndoHandler.value) {
      throw new Error("No onLoad or onUndo handler provided");
    }

    // Define the result
    let result: TResult = TResult.success();

    // Set the progress indicator
    inProgress.value = true;

    // Clear error
    errorProblemDetails.value = null;

    try {
      // Undo or load the data
      let eventResult: TResult<any> | void = undefined;

      if (props.value.onUndo) {
        eventResult = await props.value.onUndo(event);
      } else if (props.value.onLoad) {
        eventResult = await props.value.onLoad(event);
      }

      // Check if the result is a TResult and if it is a failure
      if (eventResult && eventResult instanceof TResult && !eventResult.isSuccess) {
        throw eventResult.error;
      }

      // Show a message
      snackbar.showMessage(undoSuccessSnackbarMessage.value);

      // Reset the validation
      if (formRef.value && formRef.value.resetValidation) {
        formRef.value.resetValidation();
      }

      // Set the result
      eventResult = TResult.success();
    } catch (error: any) {
      let errorResult: ErrorProblemDetails;
      if (error instanceof ErrorProblemDetails) {
        errorResult = error as ErrorProblemDetails;
      } else {
        errorResult = await toErrorProblemDetails(error);
      }

      // Show a message that the submit failed
      errorProblemDetails.value = errorResult;
      // Show a message
      snackbar.showMessage(undoFailedSnackbarMessage.value);

      // Set the result
      result = TResult.failure(error);
    } finally {
      // Set the progress indicator
      inProgress.value = false;
    }

    // Return the result
    return result;
  }

  return {
    onLoad,
    onUndo,
    hasLoadHandler,
    hasUndoHandler,
    loadFailedSnackbarMessage,
    undoSuccessSnackbarMessage,
    undoButtonLabel,
    isUndoDisabled,
  };
}
