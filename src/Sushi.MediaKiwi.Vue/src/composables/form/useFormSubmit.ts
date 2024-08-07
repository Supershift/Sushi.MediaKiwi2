import { ProblemDetails } from "@/models/errors/ProblemDetails";
import { ComputedRef, ModelRef, Ref, computed, reactive, ref } from "vue";
import { useI18next as useI18nextComposable } from "./../useI18next";
import { useSnackbarStore } from "@/stores";
import { FormSlotProps, SubmitProps } from "@/models/form";
import { TResult } from "@/models/form/TResult";

export async function useFormSubmit(
  useI18next: ReturnType<typeof useI18nextComposable>,
  props: ComputedRef<SubmitProps>,
  inProgress: ModelRef<boolean, string>,
  isValid: ModelRef<any, string>,
  problemDetails: ModelRef<ProblemDetails | null | undefined, string>,
  formRef: Ref<any>,
  formId: string
) {
  // Inject Dependencies
  const { defaultT } = await useI18next;
  const snackbar = useSnackbarStore();

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

  async function handleSubmit(event?: Event): Promise<TResult> {
    if (!props.value.onSubmit) {
      throw new Error("No onSubmit handler provided");
    }

    let result: TResult = TResult.failure();
    if (isValid.value) {
      // Set the progress indicator
      inProgress.value = true;

      // Clear error
      problemDetails.value = null;

      try {
        // Submit the data
        await props.value.onSubmit(event);

        if (!props.value.hideSubmitSnackbar) {
          // Show a message that the submit was successful
          snackbar.showMessage(submitSuccessMessage.value);
        }

        // Set the result
        result = TResult.success();

        // Reset the form
        if (props.value.resetOnSubmit && formRef.value && formRef.value.reset) {
          formRef.value.reset();
        }
      } catch (error: ProblemDetails | any) {
        // Set the error
        problemDetails.value = error as ProblemDetails;
        result = TResult.failure(problemDetails.value);
      } finally {
        inProgress.value = false;
      }
    }

    return result;
  }

  /**
   * Prompt the user for confirmation before submitting the form   *
   */
  async function onSubmit(event?: Event, confirmed?: boolean): Promise<TResult> {
    let result: TResult = TResult.failure();

    if (isValid.value) {
      if (props.value.confirmBeforeSubmit && !confirmed) {
        // prompt configrm
        submitConfirmDialog.value = true;
        result = TResult.failure();
      } else {
        // handle the submit
        result = await handleSubmit(event);
      }
    }

    return result;
  }

  /**
   * Handle a click event, call a callback
   * @param callback
   * @returns
   */
  async function onClick(callback: () => Promise<any>) {
    let result: TResult = TResult.failure();

    try {
      // Set the progress indicator
      inProgress.value = true;

      // Trigger the callback
      await callback();

      // set the result
      result = TResult.success();
    } catch (error: ProblemDetails | any) {
      problemDetails.value = error as ProblemDetails;
      result = TResult.failure(problemDetails.value);
    } finally {
      inProgress.value = false;
    }

    return result;
  }

  const formSlotProps = computed<FormSlotProps>(() => {
    return <FormSlotProps>{
      form: formId,
      onClick,
    };
  });

  return {
    // state
    submitConfirmDialog,
    isSubmitDisabled,
    submitButtonColor,
    hasSubmitHandler,
    // functions
    onSubmit,
    // computed labls
    submitButtonLabel,
    submitConfirmationTitle,
    submitConfirmationBody,
    submitSuccessMessage,
    // Slot props
    formSlotProps,
  };
}
