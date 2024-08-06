<script setup lang="ts" generic="T extends Object">
  import ProblemDetailsComponent from "./MkProblemDetails.vue";
  import { ProblemDetails } from "@/models/errors/ProblemDetails";
  import { ref, onMounted, watch } from "vue";
  import { useI18next } from "@/composables";
  import { useForm } from "@/composables/form/useForm";
  import MkDialogCard from "../MkDialog/MkDialogCard.vue";
  import { FormDialogProps } from "@/models/form";
  import { useMediakiwiVueOptions } from "@/composables/useMediakiwiVueOptions";

  // Inject dependencies
  const { defaultT } = await useI18next();
  const { formOptions } = useMediakiwiVueOptions();

  // Define props
  const props = defineProps<FormDialogProps>();

  // Define props defaults
  const propDefaults = <FormDialogProps>{
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
    default: void;
    actions?: void;
    prependBody?: void;
  }>();

  /** Update dialog state */
  function updateDialog(value: boolean) {
    // https://vuetifyjs.com/en/components/forms/#exposed-properties
    formRef.value?.resetValidation();

    // Clear the error
    problemDetails.value = undefined;

    // Update the dialog state
    modelValue.value = value;
  }

  async function onClose() {
    // Emit the dialog
    updateDialog(false);
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
    if (props.validateOnLoad) {
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
  <v-dialog v-model="modelValue" :width="computedProps.width" close-on-back @update:model-value="updateDialog" @close="onClose">
    <template #default>
      <v-form v-model="isValid" :validate-on="computedProps.validateOn" ref="formRef" @submit.prevent="onSubmitForm">
        <MkDialogCard @click:close="onClose" :loading="inProgress" :height="height">
          <template #intro v-if="computedProps.intro || computedProps.title">
            <p v-if="computedProps.title" class="text-headline-small text-sentence-case">{{ computedProps.title }}</p>
            <p v-if="computedProps.intro" class="mt-2">{{ computedProps.intro }}</p>
          </template>

          <slot v-if="slots.prependBody" name="prependBody"></slot>

          <div class="pt-4">
            <ProblemDetailsComponent
              v-if="problemDetails"
              :problem-details="problemDetails"
              class="mb-4"
              :show-details="computedProps.showProblemDetailsDetailField"
            />

            <slot name="default"></slot>
          </div>
          <template #actions>
            <slot v-if="slots.actions" name="actions"></slot>

            <v-btn v-else type="submit">{{ submitButtonLabel || defaultT("Save") }}</v-btn>
          </template>
        </MkDialogCard>
      </v-form>
    </template>
  </v-dialog>
</template>
