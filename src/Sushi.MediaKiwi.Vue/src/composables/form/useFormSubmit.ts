// import { computed } from "vue";

import { ProblemDetails } from "@/models/errors/ProblemDetails";
import { ModelRef, computed, reactive } from "vue";
import { useI18next as useI18nextComposable } from "./../useI18next";
import { useSnackbarStore } from "@/stores";
import { SubmitProps } from "@/models/form";

export async function useFormSubmit(
  useI18next: ReturnType<typeof useI18nextComposable>,
  formProps: () => SubmitProps,
  inProgress: ModelRef<boolean, string>,
  isValid: ModelRef<any, string>,
  problemDetails: ModelRef<ProblemDetails | null | undefined, string>
) {
  // Inject Dependencies
  const { defaultT } = await useI18next;
  const snackbar = useSnackbarStore();

  // Reactive Model
  const props = computed(() => formProps());

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

  const state = reactive({
    submitConfirmDialog: false,
  });

  async function onSubmitForm(event?: Event) {
    if (!props.value.onSubmit) {
      throw new Error("No onSubmit handler provided");
    }

    if (isValid.value) {
      // Set the progress indicator
      inProgress.value = true;

      // Clear error
      problemDetails.value = null;

      // Close the dialog if needed
      closeConfirmDialog(event);

      try {
        // Submit the data
        await props.value.onSubmit(event);

        if (!props.value.hideSubmitSnackbar) {
          // Show a message that the submit was successful
          snackbar.showMessage(submitSuccessMessage.value);
        }
      } catch (error: ProblemDetails | any) {
        // Set the error
        problemDetails.value = error as ProblemDetails;
      } finally {
        inProgress.value = false;
      }
    }
  }

  /** Check weather to ask a confirmation or performs the onSubmit handler */
  async function onSubmit(event?: Event) {
    if (props.value.confirmBeforeSubmit) {
      // prompt configrm
      state.submitConfirmDialog = true;
    } else {
      // Go to the submit
      await onSubmit(event);
    }
  }

  async function closeConfirmDialog(_event?: Event) {
    state.submitConfirmDialog = false;
  }

  return {
    // State
    state,
    // functions
    onSubmitForm,
    onSubmit,
    closeConfirmDialog,
    submitButtonLabel,
    submitConfirmationTitle,
    submitConfirmationBody,
    isSubmitDisabled,
    submitButtonColor,
    hasSubmitHandler,
    submitSuccessMessage,
  };
}
