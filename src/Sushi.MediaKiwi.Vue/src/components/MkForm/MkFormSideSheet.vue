<script setup lang="ts" generic="T extends Object">
  import MkErrorProblemDetails from "@/components/MkErrorProblemDetails/MkErrorProblemDetails.vue";
  import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
  import { ref, watch, getCurrentInstance } from "vue";
  import { useI18next } from "@/composables";
  import { useForm } from "@/composables/form/useForm";
  import { FormSideSheetProps, FormSlotProps } from "@/models/form";
  import MkSideSheet from "../MkSideSheet/MkSideSheet.vue";
  import { useMediakiwiVueOptions } from "@/composables/useMediakiwiVueOptions";
  import MkConfirmDialog from "../MkConfirmDialog/MkConfirmDialog.vue";

  // Inject dependencies
  const { defaultT } = await useI18next();
  const { formOptions } = useMediakiwiVueOptions();
  const instance = getCurrentInstance();

  // Define props with defaults
  const props = defineProps<FormSideSheetProps>();

  // Define computedProps defaults
  const defaultProps = <FormSideSheetProps>{
    validateOn: "blur",
    width: "600",
    ...formOptions?.general,
    ...formOptions?.sideSheet,
  };

  /** Model to open the dialog  */
  const modelValue = defineModel<boolean>("modelValue", { required: false, default: false });
  /** The value representing if the form is processing a request. */
  const inProgress = defineModel<boolean>("inProgress", { required: false, default: false });
  /** The value representing the validity of the form. If the value is null then no validation has taken place yet, or the form has been reset. Otherwise the value will be a boolean that indicates if validation has passed or not. */
  const isValid = defineModel<boolean>("isValid", { required: false, default: false });
  /** The value representing the error that occurred during the last request. */
  const errorProblemDetails = defineModel<ErrorProblemDetails | null | undefined>("error", { required: false });

  // Form
  const formRef = ref();
  const formId = `mk-form-side-sheet__${instance?.uid}`;

  const { onLoad, onSubmit, computedProps, submitConfirmDialog, submitConfirmationTitle, submitButtonLabel, submitConfirmationBody, formSlotProps } =
    await useForm(() => props, defaultProps, formRef, formId, inProgress, isValid, errorProblemDetails);

  const slots = defineSlots<{
    /** Default Slot for your form fields */
    intro?: () => never;
    /** Default Slot for your form fields */
    default?: (props: FormSlotProps) => never;
    /** Provide the sheet with actions instead of the default */
    actions?: (props: FormSlotProps) => never;
  }>();

  /** Close the  sheet state */
  async function onClose() {
    // https://vuetifyjs.com/en/components/forms/#exposed-properties
    formRef.value?.resetValidation();

    // Clear the error
    errorProblemDetails.value = undefined;

    // Update the dialog state
    modelValue.value = false;
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
  <v-form
    v-if="modelValue"
    :id="formId"
    data-cy="form-side-sheet"
    v-model="isValid"
    :validate-on="computedProps.validateOn"
    @submit.prevent="onSubmit"
    ref="formRef"
  >
    <MkSideSheet v-model="modelValue" v-bind="$attrs" @closed-sheet="onClose" :loading="inProgress" close-button>
      <template #title v-if="computedProps.title">
        {{ computedProps.title }}
      </template>

      <template #default v-if="modelValue">
        <div class="py-6">
          <slot name="intro"></slot>
          <MkErrorProblemDetails
            v-if="errorProblemDetails"
            v-model:problem-details="errorProblemDetails"
            class="mb-6"
            :show-details="computedProps.showProblemDetailsDetailField"
            data-cy="form-side-sheet__alert"
          />

          <slot name="default" v-bind="formSlotProps"></slot>
        </div>
      </template>
      <template #footer>
        <slot v-if="slots.actions" name="actions" v-bind="formSlotProps"></slot>
        <template v-else>
          <v-btn variant="text" @click="onClose"> {{ defaultT("Cancel") }}</v-btn>
          <v-btn variant="flat" type="submit" :form="formId" :disabled="inProgress" data-cy="form-side-sheet__submit">{{ submitButtonLabel }}</v-btn>
        </template>
      </template>
    </MkSideSheet>
    <MkConfirmDialog
      v-model="submitConfirmDialog"
      :title="submitConfirmationTitle"
      :confirm-button-label="submitButtonLabel"
      :body="submitConfirmationBody"
      @confirm="(event) => onSubmit(event, true)"
    />
  </v-form>
</template>
