<script setup lang="ts" generic="T extends Object">
  import ProblemDetailsComponent from "./MkProblemDetails.vue";
  import { ProblemDetails } from "@/models/errors/ProblemDetails";
  import MkConfirmDialog from "@/components/MkConfirmDialog/MkConfirmDialog.vue";
  import { ref, onMounted } from "vue";
  import { useI18next, useNavigation } from "@/composables";
  import MkToolbar from "../MkToolbar/MkToolbar.vue";
  import MkOverflowMenuIcon from "../MkOverflowMenuIcon/MkOverflowMenuIcon.vue";
  import { useForm } from "@/composables/form/useForm";
  import { FormViewProps } from "@/models/form";
  import { useMediakiwiVueOptions } from "@/composables/useMediakiwiVueOptions";

  // Inject dependencies
  const { defaultT } = await useI18next();
  const navigation = useNavigation();
  const { formOptions } = useMediakiwiVueOptions();

  // Define props
  const props = defineProps<FormViewProps>();

  // Define computedProps defaults
  const propDefaults = <FormViewProps>{
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
  const problemDetails = defineModel<ProblemDetails | null | undefined>("error", { required: false });

  // Define refs
  const formRef = ref();

  // Define the form
  const {
    onLoad,
    onDelete,
    closeConfirmDialog,
    onSubmit,
    onSubmitForm,
    onUndo,
    state,
    hasSubmitHandler,
    hasUndoHanlder,
    submitButtonColor,
    hasDeleteHandler,
    isSubmitDisabled,
    computedProps,
  } = await useForm(useI18next(), () => props, inProgress, isValid, problemDetails, formRef, propDefaults);

  // Define slots
  const slots = defineSlots<{
    /** Additional toolbar items */
    toolbar?: void;
    /** Additional toolbar header */
    toolbarHeader?: void;
    /** Default body slot */
    default: void;
    /** Additional list items for the overflow menu */
    overflowIconItems?: void;
    /** slots for the title */
    title?: void;
  }>();

  /** Exposes refs to the parent component. */
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

  // load data async on created
  await onLoad();
</script>
<template>
  <v-form v-model="isValid" :validate-on="computedProps.validateOn" ref="formRef" @submit.prevent="onSubmitForm">
    <MkToolbar
      v-if="!hideToolbar"
      :loading="inProgress"
      v-bind="$attrs"
      :item-view-id="navigation.currentNavigationItem.value.viewId"
      :title="computedProps.title"
      :new="false"
      :submit="hasSubmitHandler"
      :undo="hasUndoHanlder"
      :sticky="computedProps.sticky ? true : false"
      @undo="onUndo"
    >
      <template v-if="slots.title" #title>
        <slot name="title"></slot>
      </template>

      <template v-if="slots.toolbarHeader" #header>
        <slot name="toolbarHeader"></slot>
      </template>

      <template #toolbar>
        <v-btn v-if="hasUndoHanlder" color="primary" @click="onUndo()">{{ defaultT("Undo Changes") }}</v-btn>
        <v-btn type="submit" v-if="hasSubmitHandler" variant="flat" :color="submitButtonColor" :disabled="isSubmitDisabled">{{ submitButtonLabel }}</v-btn>

        <slot v-if="slots.toolbar" name="toolbar"></slot>
        <MkOverflowMenuIcon v-if="hasDeleteHandler || slots.overflowIconItems">
          <MkConfirmDialog v-if="hasDeleteHandler" @confirm="onDelete" :title="deleteConfirmationTitle" :confirm-button-label="deleteButtonLabel">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="deleteButtonLabel" />
            </template>
            <template #default>
              <p>{{ deleteConfirmationBody }}</p>
            </template>
          </MkConfirmDialog>
          <slot v-if="slots.overflowIconItems" name="overflowIconItems"></slot>
        </MkOverflowMenuIcon>
      </template>
    </MkToolbar>

    <ProblemDetailsComponent v-if="problemDetails" v-model:problem-details="problemDetails" class="mb-4" :show-details="showProblemDetailsDetailField" />

    <MkConfirmDialog
      v-model="state.submitConfirmDialog"
      :title="submitConfirmationTitle"
      :confirm-button-label="submitButtonLabel"
      :body="submitConfirmationBody"
      @confirm="onSubmit"
      @cancel="closeConfirmDialog"
    />

    <slot></slot>
  </v-form>
</template>
