import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { ComputedRef, ModelRef, Ref, computed, ref } from "vue";
import { useSnackbarStore } from "@/stores";
import { SubmitProps } from "@/models/form/FormProps";
import { TResult } from "@/models/form/TResult";
import { useFormMessages } from "./useFormMessages";
import { toErrorProblemDetails } from "@/errorhandler/parser";
import { container } from "tsyringe";

export async function useFormSubmit(
  /** Props determining the configuration and labels */
  props: ComputedRef<SubmitProps>,
  /** Ref to the Form element */
  formRef: Ref<any>,
  /** Name of the entity that is being used in the form. Used in the snackbar feedback  */
  entryName: ComputedRef<string | undefined>,
  /** Model for the Progress state of the component */
  inProgress: ModelRef<boolean, string>,
  /** Model for the ErrorProblemDetails state of the component */
  errorProblemDetails: ModelRef<ErrorProblemDetails | null | undefined, string>,
  /** Model for the Valid state of the component */
  isValid: ModelRef<any, string>
) {
  // Inject Dependencies
  const snackbar = useSnackbarStore();

  const formMessages = container.resolve("formMessages") as any;

  // Entity name, used in the feedback
  const entryLabel = computed(() => entryName.value || "entry");

  // Submit button label
  const submitButtonLabel = computed(() => {
    if (props.value.submitButtonLabel) {
      return props.value.submitButtonLabel;
    } else if (props.value.saveLabels || props.value.editLabels) {
      return formMessages.saveButtonLabel();
    }
    return formMessages.submitButtonLabel();
  });

  const submitConfirmationTitle = computed(() => {
    if (props.value.submitConfirmationTitle) {
      return props.value.submitConfirmationTitle;
    } else if (props.value.saveLabels) {
      return formMessages.saveConfirmationTitle(entryLabel.value);
    } else if (props.value.editLabels) {
      return formMessages.editConfirmationTitle(entryLabel.value);
    }
    return formMessages.submitConfirmationTitle(entryLabel.value);
  });

  const submitConfirmationBody = computed(() => {
    if (props.value.submitConfirmationBody) {
      return props.value.submitConfirmationBody;
    } else if (props.value.saveLabels) {
      return formMessages.saveConfirmationBody(entryLabel.value);
    } else if (props.value.editLabels) {
      return formMessages.editConfirmationBody(entryLabel.value);
    }

    return formMessages.submitConfirmationBody(entryLabel.value);
  });

  const submitSuccessMessage = computed(() => {
    if (props.value.submitSuccessfulSnackbarMessage) {
      return props.value.submitSuccessfulSnackbarMessage;
    } else if (props.value.saveLabels) {
      return formMessages.saveSuccessMessage(entryLabel.value);
    } else if (props.value.editLabels) {
      return formMessages.editSuccessMessage(entryLabel.value);
    }

    return formMessages.submitSuccessMessage(entryLabel.value);
  });

  // submit button State
  const isSubmitDisabled = computed(() => inProgress.value);
  const submitButtonColor = computed(() => (isSubmitDisabled.value ? "neutral" : "primary"));
  const hasSubmitHandler = computed(() => (props.value.onSubmit ? true : false));

  // Confirmation Dialog state
  const submitConfirmDialog = ref(false);

  /**
   * Private function to handle the submit
   * @param event
   * @returns
   */
  async function handleSubmit(event?: Event): Promise<TResult> {
    if (!props.value.onSubmit) {
      throw new Error("No onSubmit handler provided");
    }

    // Define the result
    let result: TResult = TResult.failure();

    if (isValid.value) {
      // Set the progress indicator
      inProgress.value = true;

      // Clear error
      errorProblemDetails.value = null;

      try {
        // Submit the data
        const eventResult = await props.value.onSubmit(event);

        // Check if the result is a TResult and if it is a failure
        if (eventResult && eventResult instanceof TResult && !eventResult.isSuccess) {
          throw eventResult.error;
        }

        // Show a message that the submit was successful if not hidden
        if (!props.value.hideSubmitSnackbar) {
          snackbar.showMessage(submitSuccessMessage.value);
        }

        // Set the result
        result = TResult.success();

        // Reset the form
        if (props.value.resetOnSubmit && formRef.value && formRef.value.reset) {
          formRef.value.reset();
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

        // Set the result
        result = TResult.failure(error);
      } finally {
        inProgress.value = false;
      }
    }

    return result;
  }

  /**
   * Event to submit the data for the form
   */
  async function onSubmit(event?: Event, confirmed?: boolean): Promise<TResult> {
    // Define the result
    let result: TResult = TResult.failure();

    // Check if the form is valid
    if (isValid.value) {
      // Check if the form should be confirmed and is confirmed before submitting
      // If not, prompt the user for confirmation
      // If confirmed, submit the form
      if (props.value.confirmBeforeSubmit && !confirmed) {
        // prompt configrm
        submitConfirmDialog.value = true;

        // set the result
        result = TResult.failure();
      } else {
        // handle the submit
        result = await handleSubmit(event);
      }
    }

    // return the result
    return result;
  }

  return {
    onSubmit,
    submitConfirmDialog,
    isSubmitDisabled,
    submitButtonColor,
    hasSubmitHandler,
    submitButtonLabel,
    submitConfirmationTitle,
    submitConfirmationBody,
    submitSuccessMessage,
  };
}
