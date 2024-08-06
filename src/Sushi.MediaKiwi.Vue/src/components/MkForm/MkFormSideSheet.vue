<script setup lang="ts" generic="T extends Object">
  import ProblemDetailsComponent from "./MkProblemDetails.vue";
  import { ProblemDetails } from "@/models/errors/ProblemDetails";
  import { ref, onMounted, watch, computed } from "vue";
  import { useI18next } from "@/composables";
  import { useForm } from "@/composables/form/useForm";
  import { FormSideSheetProps } from "@/models/form";
  import MkSideSheet from "../MkSideSheet/MkSideSheet.vue";
  import { useMediakiwiVueOptions } from "@/composables/useMediakiwiVueOptions";

  // Inject dependencies
  const { defaultT } = await useI18next();
  const { formOptions } = useMediakiwiVueOptions();
  const formDialogOptions = computed<Partial<FormSideSheetProps>>(() => {
    return {
      ...formOptions?.sideSheet,
    };
  });

  // Define props with defaults
  const props = defineProps<FormSideSheetProps>();

  // Define computedProps defaults
  const propDefaults = <FormSideSheetProps>{
    validateOn: "blur",
    width: "600",
    ...formOptions?.general,
    ...formOptions?.sideSheet,
  };

  /** Model to open the dialog  */
  const modelValue = defineModel<boolean>("modelValue", { required: true });
  /** The value representing if the form is processing a request. */
  const inProgress = defineModel<boolean>("inProgress", { required: false, default: false });
  /** The value representing the validity of the form. If the value is null then no validation has taken place yet, or the form has been reset. Otherwise the value will be a boolean that indicates if validation has passed or not. */
  const isValid = defineModel<boolean>("isValid", { required: false, default: false });
  /** The value representing the error that occurred during the last request. */
  const problemDetails = defineModel<ProblemDetails | null | undefined>("error", { required: false });

  // Form
  const formRef = ref();

  const { onLoad, onSubmitForm, submitButtonLabel, computedProps } = await useForm(
    useI18next(),
    () => props,
    inProgress,
    isValid,
    problemDetails,
    formRef,
    propDefaults
  );

  const slots = defineSlots<{
    /** Default Slot for your form fields */
    intro?: () => never;
    /** Default Slot for your form fields */
    default?: () => never;
    /** Provide the Dialog with additional actions if the default Submit is not enough */
    actions?: () => never;
  }>();

  /** Update sheet state */
  function updateSheet(value: boolean) {
    // https://vuetifyjs.com/en/components/forms/#exposed-properties
    formRef.value?.resetValidation();

    // Clear the error
    problemDetails.value = undefined;

    // Update the dialog state
    modelValue.value = value;
  }

  async function onClose() {
    // Emit the dialog
    updateSheet(false);
  }

  /**
   * Exposes refs to the parent component.
   * @example <Form ref="mkFormRef" ... />
   */
  defineExpose({
    /** Reference to the Vuetify Form */
    formRef,
    /** Clear the form */
    reset: () => {
      formRef.value?.reset();
    },
  });

  onMounted(() => {
    if (computedProps.value.validateOnLoad) {
      // https://vuetifyjs.com/en/components/forms/#exposed-properties
      formRef.value?.validate();
    }
  });

  watch(
    () => modelValue.value,
    (value) => {
      if (!value) {
        // Clear the state
        formRef.value?.reset();
      }
    }
  );

  // load data async on created
  await onLoad();
</script>
<template>
  <v-form
    v-if="modelValue"
    id="form-side-sheet"
    data-cy="form-side-sheet"
    v-model="isValid"
    :validate-on="computedProps.validateOn"
    @submit.prevent="onSubmitForm"
    ref="formRef"
  >
    <MkSideSheet v-model="modelValue" v-bind="$attrs" @closed-sheet="onClose" :loading="inProgress" close-button>
      <template #title v-if="computedProps.title">
        {{ computedProps.title }}
      </template>

      <template #default v-if="modelValue">
        <div class="py-6">
          <slot name="intro"></slot>
          <ProblemDetailsComponent
            v-if="problemDetails"
            :problem-details="problemDetails"
            class="mb-6"
            :show-details="computedProps.showProblemDetailsDetailField"
            data-cy="form-side-sheet__alert"
          />

          <slot name="default"></slot>
        </div>
      </template>
      <template #footer>
        <slot v-if="slots.actions" name="actions"></slot>
        <template v-else>
          <v-btn variant="text" @click="onClose" :disabled="inProgress"> {{ defaultT("Cancel") }}</v-btn>
          <v-btn variant="flat" type="submit" form="form-side-sheet" :disabled="inProgress" data-cy="form-side-sheet__submit">{{
            submitButtonLabel || defaultT("Save")
          }}</v-btn>
        </template>
      </template>
    </MkSideSheet>
  </v-form>
</template>
