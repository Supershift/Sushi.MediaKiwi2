<script setup lang="ts" generic="T extends Object">
  import MkErrorProblemDetails from "@/components/MkErrorProblemDetails/MkErrorProblemDetails.vue";
  import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
  import { ref, watch, getCurrentInstance } from "vue";
  import { useForm } from "@/composables/form/useForm";
  import MkDialogCard from "../MkDialog/MkDialogCard.vue";
  import { FormDialogProps, FormSlotProps } from "@/models/form/FormProps";
  import { useMediakiwiVueOptions } from "@/composables/useMediakiwiVueOptions";
  import MkConfirmDialog from "../MkConfirmDialog/MkConfirmDialog.vue";
  import { useErrorMessages } from "@/composables/useErrorMessages";

  // Inject dependencies
  const { formOptions } = useMediakiwiVueOptions();
  const instance = getCurrentInstance();
  const errorMessages = await useErrorMessages();

  // Define props
  const props = withDefaults(defineProps<FormDialogProps>(), {
    closeOnSubmit: undefined,
    showProblemDetailsDetailField: undefined,
    validateOnLoad: undefined,
    confirmBeforeSubmit: undefined,
    hideSubmitSnackbar: undefined,
    resetOnSubmit: undefined,
    saveLabels: undefined,
    editLabels: undefined,
    redirectAfterDelete: undefined,
    hideDeleteSnackbar: undefined,
    hideUndo: undefined,
  });

  // Define props defaults
  const defaultProps = <FormDialogProps>{
    validateOn: "blur",
    width: "600",
    ...formOptions?.general,
    ...formOptions?.dialog,
  };

  /** Model to open the dialog  */
  const modelValue = defineModel<boolean>("modelValue", { required: false, default: false });
  /** The value representing if the form is processing a request. */
  const inProgress = defineModel<boolean>("inProgress", { required: false, default: false });
  /** The value representing the validity of the form. If the value is null then no validation has taken place yet, or the form has been reset. Otherwise the value will be a boolean that indicates if validation has passed or not. */
  const isValid = defineModel<boolean>("isValid", { required: false, default: false });
  /** The value representing the error that occurred during the last request. */
  const errorProblemDetails = defineModel<ErrorProblemDetails | null | undefined>("error", { required: false });
  /** Indicator that the forms onLoad event has been completed  */
  const isLoaded = ref<boolean>(false);

  // Form
  const formRef = ref();
  const formId = `mk-form-dialog__${instance?.uid}`;

  const { onLoad, onSubmit, computedProps, submitConfirmDialog, submitConfirmationTitle, submitButtonLabel, submitConfirmationBody, formSlotProps } =
    await useForm(() => props, defaultProps, formRef, formId, inProgress, isValid, errorProblemDetails, isLoaded);

  const slots = defineSlots<{
    default: void;
    /** Provide the dialog with actions instead of the default */
    actions?: (props: FormSlotProps) => never;
    prependBody?: void;
  }>();

  /** Update dialog state */
  function updateDialog(value: boolean) {
    // https://vuetifyjs.com/en/components/forms/#exposed-properties
    formRef.value?.resetValidation();

    // Clear the error
    errorProblemDetails.value = undefined;

    // Update the dialog state
    modelValue.value = value;
  }

  async function onClose() {
    // Emit the dialog
    updateDialog(false);

    // Trigger the onClose
    computedProps.value?.onClose?.();
  }

  async function onSubmitAndClose(event?: Event, confirm?: boolean) {
    // Submit the form
    const result = await onSubmit(event, confirm);

    if (result.isSuccess) {
      if (computedProps.value.closeOnSubmit) {
        onClose();
      }
    }
  }

  /**
   * Exposes refs to the parent component.
   * @example <Form ref="mkFormRef" ... />
   */
  /** Exposes refs to the parent component. */
  defineExpose({
    validate: () => {
      formRef.value?.validate();
    },
    /** Clear the form */
    reset: () => {
      formRef.value?.reset();
    },
    resetValidation() {
      formRef.value?.resetValidation();
    },
    setError(error: ErrorProblemDetails) {
      if (!error || !error.detail || !error.error) {
        error = new ErrorProblemDetails(errorMessages.unexpectedErrorMessage);
      }
      errorProblemDetails.value = error;
    },
  });

  watch(
    () => modelValue.value,
    async (value) => {
      if (!value) {
        // Clear the state
        formRef.value?.reset();
      }
      if (value) {
        // load data async on created
        await onLoad();
      }
    }
  );
</script>
<template>
  <v-dialog v-model="modelValue" :width="computedProps?.width" close-on-back @update:model-value="updateDialog" @close="onClose">
    <template #default>
      <v-form :id="formId" v-model="isValid" :validate-on="computedProps.validateOn" ref="formRef" @submit.prevent="onSubmitAndClose">
        <MkDialogCard @click:close="onClose" :loading="inProgress" :height="height">
          <template #intro v-if="computedProps.intro || computedProps.title">
            <p v-if="computedProps.title" class="text-headline-small text-sentence-case">
              {{ computedProps.title }}
            </p>
            <p v-if="computedProps.intro" class="mt-2">{{ computedProps.intro }}</p>
          </template>

          <slot v-if="slots.prependBody" name="prependBody"></slot>

          <div class="pt-4">
            <MkErrorProblemDetails
              v-if="errorProblemDetails"
              v-model:problem-details="errorProblemDetails"
              class="mb-4"
              :show-details="computedProps.showProblemDetailsDetailField"
            />

            <slot name="default"></slot>
          </div>
          <template #actions>
            <slot v-if="slots.actions" name="actions" v-bind="formSlotProps"></slot>

            <v-btn v-else type="submit" :form="formId">{{ submitButtonLabel }}</v-btn>
          </template>
        </MkDialogCard>
      </v-form>

      <MkConfirmDialog
        v-model="submitConfirmDialog"
        :title="submitConfirmationTitle"
        :confirm-button-label="submitButtonLabel"
        :body="submitConfirmationBody"
        @confirm="(event) => onSubmitAndClose(event, true)"
      />
    </template>
  </v-dialog>
</template>
