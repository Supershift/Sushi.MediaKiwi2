<script setup lang="ts" generic="T extends Object">
  import MkErrorProblemDetails from "@/components/MkErrorProblemDetails/MkErrorProblemDetails.vue";
  import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
  import MkConfirmDialog from "@/components/MkConfirmDialog/MkConfirmDialog.vue";
  import { ref, getCurrentInstance } from "vue";
  import MkToolbar from "../MkToolbar/MkToolbar.vue";
  import MkOverflowMenuIcon from "../MkOverflowMenuIcon/MkOverflowMenuIcon.vue";
  import { FormSlotProps, FormViewProps } from "@/models/form/FormProps";
  //
  import { useMediakiwiVueOptions } from "@/composables/useMediakiwiVueOptions";
  import { useForm } from "@/composables/form/useForm";
  import { useNavigation } from "@/composables/useNavigation";

  // Inject dependencies
  const navigation = useNavigation();
  const { formOptions } = useMediakiwiVueOptions();
  const instance = getCurrentInstance();

  // Define props
  const props = defineProps<FormViewProps>();

  // Define computedProps defaults
  const defaultProps = <FormViewProps>{
    redirectAfterDelete: true,
    validateOn: "blur",
    ...formOptions?.general,
    ...formOptions?.view,
  };

  /** The value representing if the form is processing a request. */
  const inProgress = defineModel<boolean>("inProgress", { required: false, default: false });
  /** The value representing the validity of the form. If the value is null then no validation has taken place yet, or the form has been reset. Otherwise the value will be a boolean that indicates if validation has passed or not. */
  const isValid = defineModel<boolean>("isValid", { required: false, default: false });
  /** The value representing the error that occurred during the last request. */
  const errorProblemDetails = defineModel<ErrorProblemDetails | null | undefined>("error", { required: false });
  /** Indicator that   */
  const isLoaded = ref<boolean>(false);

  // Define refs
  const formRef = ref();
  const formId = `mk-form-view__${instance?.uid}`;

  // Define the form
  const {
    onLoad,
    onDelete,
    onSubmit,
    onUndo,
    submitConfirmDialog,
    hasSubmitHandler,
    hasUndoHanlder,
    submitButtonColor,
    hasDeleteHandler,
    isSubmitDisabled,
    computedProps,
    submitConfirmationTitle,
    submitButtonLabel,
    submitConfirmationBody,
    undoButtonLabel,
    formSlotProps,
    deleteButtonLabel,
    deleteConfirmationTitle,
    deleteConfirmationBody,
    hasLoadHandler,
  } = await useForm(() => props, defaultProps, formRef, formId, inProgress, isValid, errorProblemDetails, isLoaded);

  // Define slots
  const slots = defineSlots<{
    /** Additional toolbar items */
    toolbar?: (props: FormSlotProps) => never;
    /** Additional toolbar header */
    toolbarHeader?: (props: FormSlotProps) => never;
    /** Default body slot */
    default?: (props: FormSlotProps) => never;
    /** Additional list items for the overflow menu */
    overflowIconItems?: (props: FormSlotProps) => never;
    /** slots for the title */
    title?: void;
    /** Provide the form with actions instead of the default */
    actions?: (props: FormSlotProps) => never;
  }>();

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

  // load data async on created
  onLoad();
</script>
<template>
  <v-progress-linear v-if="inProgress" indeterminate></v-progress-linear>

  <v-form v-if="isLoaded" :id="formId" v-model="isValid" :validate-on="computedProps.validateOn" ref="formRef" @submit.prevent="onSubmit">
    <MkToolbar
      v-if="!computedProps.hideToolbar"
      v-bind="$attrs"
      :item-view-id="navigation.currentNavigationItem.value.viewId"
      :title="computedProps.title"
      :new="false"
      :sticky="computedProps.sticky ? true : false"
    >
      <template v-if="slots.title" #title>
        <slot name="title" v-bind="formSlotProps"></slot>
      </template>

      <template v-if="slots.toolbarHeader" #header>
        <slot name="toolbarHeader" v-bind="formSlotProps"></slot>
      </template>

      <template #toolbar>
        <slot v-if="slots.actions" name="actions" v-bind="formSlotProps"></slot>
        <template v-else>
          <slot v-if="slots.toolbar" name="toolbar" v-bind="formSlotProps"></slot>
          <v-btn v-if="hasUndoHanlder" color="primary" @click="onUndo()">{{ undoButtonLabel }}</v-btn>
          <v-btn type="submit" v-if="hasSubmitHandler" variant="flat" :color="submitButtonColor" :disabled="isSubmitDisabled" :form="formId">{{
            submitButtonLabel
          }}</v-btn>

          <MkOverflowMenuIcon v-if="hasDeleteHandler || slots.overflowIconItems">
            <MkConfirmDialog v-if="hasDeleteHandler" @confirm="onDelete" :title="deleteConfirmationTitle" :confirm-button-label="deleteButtonLabel">
              <template #activator="{ props }">
                <v-list-item v-bind="props" :title="deleteButtonLabel" />
              </template>
              <template #default>
                <p>{{ deleteConfirmationBody }}</p>
              </template>
            </MkConfirmDialog>
            <slot v-if="slots.overflowIconItems" name="overflowIconItems" v-bind="formSlotProps"></slot>
          </MkOverflowMenuIcon>
        </template>
      </template>
    </MkToolbar>

    <MkErrorProblemDetails
      v-if="errorProblemDetails"
      v-model:problem-details="errorProblemDetails"
      class="mb-4"
      :show-details="computedProps.showProblemDetailsDetailField"
    />

    <MkConfirmDialog
      v-model="submitConfirmDialog"
      :title="submitConfirmationTitle"
      :confirm-button-label="submitButtonLabel"
      :body="submitConfirmationBody"
      @confirm="(event) => onSubmit(event, true)"
    />

    <slot name="default" v-bind="formSlotProps"></slot>
  </v-form>
</template>
