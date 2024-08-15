<script setup lang="ts">
  import { useI18next } from "@/composables";
  import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
  import { TResult } from "@/models/form/TResult";
  import { computed, ModelRef, ref } from "vue";

  // Inject dependencies
  const { defaultT } = await useI18next();

  /** Type of Props the Acticator  */
  type ConfirmDialogActivatorProps = {
    props: {
      /** Function to open the Dialog */
      onClick: () => void;
    };
  };

  const props = withDefaults(
    defineProps<{
      onConfirm: (event?: Event) => Promise<any>;
      onCancel?: (event?: Event) => Promise<any>;
      title?: string;
      body?: string;
      width?: string;
      openButtonOpen?: string;
      cancelButtonLabel?: string;
      confirmButtonLabel?: string;
    }>(),
    {
      width: "312",
    }
  );

  const state = defineModel<boolean>("modelValue", { required: false, default: false });
  const errorProblemDetails = defineModel<ErrorProblemDetails | null | undefined>("error", { required: false });

  const activatorProps = <ConfirmDialogActivatorProps>{
    props: {
      onClick: open,
    },
  };

  const slots = defineSlots<{
    /** Activator slot to open the confirmation */
    activator?: (props: ConfirmDialogActivatorProps) => never;
    /** Default body slot for the dialog */
    default?: (props: unknown) => never;
  }>();

  /** State object for the open and closed state */
  const openButtonLabel = computed(() => props.openButtonOpen ?? defaultT.value("Open"));
  const cancelButtonLabel = computed(() => props.cancelButtonLabel ?? defaultT.value("Cancel"));
  const confirmButtonLabel = computed(() => props.confirmButtonLabel ?? defaultT.value("Confirm"));
  const titleLabel = computed(() => props.title ?? defaultT.value("Confirm"));

  /** Opens the dialog */
  function open(event?: Event) {
    // Open the dialog
    state.value = true;

    // Prevent the event from bubbling up
    event?.stopPropagation();
  }

  /** Closes the dialog */
  function close() {
    // Close the dialog
    state.value = false;

    // Call the onCancel handler
    if (props.onCancel) {
      props.onCancel();
    }
  }

  /** Confirms the action */
  async function confirm(event?: Event) {
    if (!props.onConfirm) {
      throw new Error("No onConfirm handler provided");
    }

    try {
      // Call the onConfirm handler
      await props.onConfirm(event);
    } catch (error: ErrorProblemDetails | any) {
      // Set the error
      errorProblemDetails.value = error;
    } finally {
      // Close the dialog
      state.value = false;
    }
  }
</script>
<template>
  <v-dialog v-model="state" :width="props.width" @click:outside="close" v-bind="$attrs">
    <template #activator>
      <slot v-if="slots.activator" name="activator" v-bind="activatorProps"></slot>
      <v-btn v-else-if="openButtonOpen" @click="open"> {{ openButtonLabel }}</v-btn>
    </template>
    <template #default>
      <v-card class="dialog-card" rounded="lg" variant="elevated">
        <v-card-title v-if="titleLabel" tag="p" class="px-6 pt-6 pb-0 text-label-large">{{ titleLabel }}</v-card-title>

        <v-card-text v-if="slots?.default || body" class="pb-6 text-body-medium">
          <slot v-if="slots.default" name="default"></slot>
          <p v-else-if="props.body">{{ body }}</p>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn :text="cancelButtonLabel" @click="close"></v-btn>
          <v-btn :text="confirmButtonLabel" @click="confirm"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
