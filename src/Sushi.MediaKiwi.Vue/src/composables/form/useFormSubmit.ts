import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { ComputedRef, ModelRef, Ref, computed, reactive, ref } from "vue";
import { useI18next } from "./../useI18next";
import { useSnackbarStore } from "@/stores";
import { SubmitProps } from "@/models/form";
import { TResult } from "@/models/form/TResult";
import { useErrorProblemDetails } from "../useErrorProblemDetails";

export async function useFormSubmit(
  /** Props determining the configuration and labels */
  props: ComputedRef<SubmitProps>,
  /** Ref to the Form element */
  formRef: Ref<any>,
  /** Custom id for the Form Element */
  formId: string,
  /** Model for the Progress state of the component */
  inProgress: ModelRef<boolean, string>,
  /** Model for the Valid state of the component */
  isValid: ModelRef<any, string>,
  /** Model for the ErrorProblemDetails state of the component */
  errorProblemDetails: ModelRef<ErrorProblemDetails | null | undefined, string>
) {
  // Inject Dependencies
  const { defaultT } = await useI18next();
  const snackbar = useSnackbarStore();
  const { toErrorProblemDetails } = useErrorProblemDetails();

  // Submit button label
  const submitButtonLabel = computed(() => props.value.submitButtonLabel || defaultT.value("Submit"));
  const submitConfirmationTitle = computed(() => props.value.submitConfirmationTitle || defaultT.value("SubmitConfirmTitle", "Submit this entry"));
  const submitConfirmationBody = computed(
    () => props.value.submitConfirmationBody || defaultT.value("SubmitConfirmBody", "Are you sure you want to submit the changes?")
  );
  const submitSuccessMessage = computed(
    () => props.value.submitSuccessfulSnackbarMessage || defaultT.value("SubmitSuccessful", "Submitted successfully").toString()
  );

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
        await props.value.onSubmit(event);

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
