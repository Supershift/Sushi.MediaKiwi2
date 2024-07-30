<script setup lang="ts" generic="T extends Object">
  import ProblemDetailsComponent from "./MkProblemDetails.vue";
  import { ProblemDetails } from "@/models/errors/ProblemDetails";
  import MkConfirmDialog from "@/components/MkConfirmDialog/MkConfirmDialog.vue";
  import { ref, computed, reactive, onMounted } from "vue";
  import { useI18next, useNavigation } from "@/composables";
  import { useSnackbarStore } from "@/stores";
  import MkToolbar from "../MkToolbar/MkToolbar.vue";
  import MkOverflowMenuIcon from "../MkOverflowMenuIcon/MkOverflowMenuIcon.vue";

  const { defaultT } = await useI18next();
  const snackbar = useSnackbarStore();
  const navigation = useNavigation();

  type EventProps = {
    /** Callback invoked when the save button is pressed. */
    onSave?: (event?: Event) => Promise<void>;
    /** Callback invoked when the component needs data. */
    onLoad?: (event?: Event) => Promise<void>;
    /** Callback invoked when the delete button is pressed. */
    onDelete?: (event?: Event) => Promise<boolean> | Promise<void>;
  };

  type SnackBarMessages = {
    /** Snackbar message when {@link onLoad} failed */
    loadFailedSnackbarMessage?: string;
    /** Snackbar message when {@link onSave} was sucessfull */
    savedSuccessfulSnackbarMessage?: string;
    /** Snackbar message when {@link onSave} failed */
    saveFailedSnackbarMessage?: string;
    /** Snackbar message when {@link onDelete} was sucessfull */
    deleteSuccessfullSnackbarMessage?: string;
    /** Snackbar message when {@link onDelete} failed */
    deleteFailedSnackbarMessage?: string;
    /** Snackbar message when undo was sucessfull */
    undoSuccessSnackbarMessage?: string;
    /** Snackbar message when undo failed */
    undoFailedSnackbarMessage?: string;
  };

  type LoadProps = {
    validateOn?: "blur" | "submit" | "input" | "input lazy" | "blur lazy" | "submit lazy" | "lazy input" | "lazy blur" | "lazy submit" | "lazy";
    validateOnLoad?: boolean;
  };

  type SaveProps = {
    /** Custom label for the default save button */
    saveButtonLabel?: string;
    /** Title for the confirmation dialog */
    saveConfirmationTitle?: string;
    /** Body for the confirmation dialog */
    saveConfirmationBody?: string;
    /** Triggers a dialog prompt before save */
    confirmBeforeSave?: boolean;
  };

  type DeleteProps = {
    /** Custom label for the default delete button */
    deleteButtonLabel?: string;
    /** Title for the confirmation dialog */
    deleteConfirmationTitle?: string;
    /** Body for the confirmation dialog */
    deleteConfirmationBody?: string;
    /** navigateToParent after delete is completed  */
    redirectAfterDelete?: boolean;
  };

  const props = withDefaults(
    defineProps<
      EventProps &
        SnackBarMessages &
        LoadProps &
        SaveProps &
        DeleteProps & {
          /** Show the {@link ProblemDetails} detail value */
          showProblemDetailsDetailField?: boolean;
          /** If true, the toolbar will be sticky on top of the page. */
          sticky?: boolean;
          /** Title of the form */
          title?: string;
          /** If true, the toolbar will be hidden. */
          hideToolbar?: boolean;
        }
    >(),
    {
      redirectAfterDelete: true,
      validateOn: "blur",
    }
  );

  /** The value representing if the form is processing a request. */
  const inProgress = defineModel<boolean>("inProgress", { required: false, default: false });
  /** The value representing the validity of the form. If the value is null then no validation has taken place yet, or the form has been reset. Otherwise the value will be a boolean that indicates if validation has passed or not. */
  const isValid = defineModel<boolean>("isValid", { required: false, default: false });
  /** The value representing the error that occurred during the last request. */
  const error = defineModel<ProblemDetails | null | undefined>("error", { required: false });

  // Form
  const formRef = ref();
  const formTitle = computed(() => props.title ?? navigation.currentNavigationItem.value.viewId);

  // Load Labels
  const loadFailedSnackbarMessage = computed(() => props.loadFailedSnackbarMessage || defaultT.value("Failed to load data").toString());

  // Delete button label
  const deleteButtonLabel = computed(() => props.deleteButtonLabel || defaultT.value("Delete"));
  const deleteConfirmationTitle = computed(() => props.deleteConfirmationTitle || props.deleteButtonLabel || defaultT.value("Delete this entry"));
  const deleteConfirmationBody = computed(
    () => props.deleteConfirmationBody || defaultT.value("DeleteBody", "Are you sure you want to delete this entry permanently?")
  );
  const deleteSuccessfulMessage = computed(() => props.deleteSuccessfullSnackbarMessage || defaultT.value("Deleted successfully").toString());
  const deleteFailedMessage = computed(() => props.deleteFailedSnackbarMessage || defaultT.value("Failed to delete").toString());

  // Save button label
  const saveButtonLabel = computed(() => props.saveButtonLabel || defaultT.value("Save"));
  const saveConfirmationTitle = computed(() => props.saveConfirmationTitle || defaultT.value("Save this entry"));
  const saveConfirmationBody = computed(() => props.saveConfirmationBody || defaultT.value("SaveConfirmBody", "Are you sure you want to save the changes?"));
  const saveSuccessMessage = computed(() => props.savedSuccessfulSnackbarMessage || defaultT.value("Saved successfully").toString());
  const saveFailedMessage = computed(() => props.saveFailedSnackbarMessage || defaultT.value("Failed to save").toString());

  // Undo Labels
  const undoSuccessSnackbarMessage = computed(() => props.undoSuccessSnackbarMessage || defaultT.value("Changes reverted").toString());
  const undoFailedSnackbarMessage = computed(() => props.undoFailedSnackbarMessage || defaultT.value("Failed to revert changes").toString());

  // save button State
  const isSaveDisabled = computed(() => inProgress.value);
  const saveButtonColor = computed(() => (isSaveDisabled.value ? "neutral" : "primary"));

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

  const hasSaveHandler = computed(() => (props.onSave ? true : false));
  const hasLoadHandler = computed(() => (props.onLoad ? true : false));
  const hasDeleteHandler = computed(() => (props.onDelete ? true : false));
  const hasUndoHanlder = computed(() => hasLoadHandler.value && hasLoadHandler.value);

  const state = reactive({
    saveConfirmDialog: false,
  });

  async function onSave(event?: Event) {
    if (!props.onSave) {
      throw new Error("No onSave handler provided");
    }

    if (isValid.value) {
      // Set the progress indicator
      inProgress.value = true;

      // Clear error
      error.value = null;

      // Close the dialog if needed
      closeConfirmDialog(event);

      try {
        // Save the data
        await props.onSave(event);

        // Show a message that the save was successful
        snackbar.showMessage(saveSuccessMessage.value);
      } catch (error: ProblemDetails | any) {
        // Show a message that the save failed
        snackbar.showMessage(saveFailedMessage.value);

        // Set the error
        error.value = error;
      } finally {
        inProgress.value = false;
      }
    }
  }

  async function onLoad(event?: Event) {
    if (props.onLoad) {
      inProgress.value = true;
      // Load the data
      props
        .onLoad(event)
        .then((data) => {
          console.log(data);
        })
        .then(() => {
          console.log("done");
        })
        .catch((error: ProblemDetails | any) => {
          // Set the error
          error.value = error;

          // Show a message that the load failed
          snackbar.showMessage(loadFailedSnackbarMessage.value);
        })
        .finally(() => {
          inProgress.value = false;
        });
      // try {

      // } catch (error: ProblemDetails | any) {
      //   // Set the error
      //   error.value = error;

      //   // Show a message that the load failed
      //   snackbar.showMessage(loadFailedSnackbarMessage.value);
      // } finally {
      //   inProgress.value = false;
      // }
    }
  }

  async function onUndo(event?: Event) {
    if (!props.onLoad) {
      throw new Error("No onLoad handler provided");
    }

    inProgress.value = true;

    try {
      await props.onLoad(event);

      // Show a message
      snackbar.showMessage(undoSuccessSnackbarMessage.value);

      // https://vuetifyjs.com/en/components/forms/#exposed-properties
      formRef.value?.resetValidation();
    } catch (error: ProblemDetails | any) {
      // Show a message
      snackbar.showMessage(undoFailedSnackbarMessage.value);

      // Set the error
      error.value = error;
    } finally {
      inProgress.value = false;
    }
  }

  async function onDelete(event?: Event) {
    if (!props.onDelete) {
      throw new Error("No onDelete handler provided");
    }
    inProgress.value = true;

    try {
      // Delete the data
      await props.onDelete(event);

      // Show a message that the delete was successful
      snackbar.showMessage(deleteSuccessfulMessage.value);

      if (props.redirectAfterDelete && navigation.currentNavigationItem.value?.parent) {
        // Redirect to the top list
        navigation.navigateToParent();
      }
    } catch (error: ProblemDetails | any) {
      snackbar.showMessage(deleteFailedMessage.value);
      error.value = error;
    } finally {
      inProgress.value = false;
    }
  }

  /** Check weather to ask a confirmation or performs the onSave handler */
  async function askConfirm(event?: Event) {
    if (props.confirmBeforeSave) {
      // prompt configrm
      state.saveConfirmDialog = true;
    } else {
      // Go to the save
      await onSave(event);
    }
  }

  async function closeConfirmDialog(_event?: Event) {
    state.saveConfirmDialog = false;
  }

  /**
   * Exposes refs to the parent component.
   * @example <Form ref="mkFormRef" ... />
   */
  defineExpose({
    /** Reference to the Vuetify Form */
    formRef,
    /** Determines if the save button should be disabled, using isValid and IsDirty */
    isSaveDisabled,
    /** Trigger the submit handler from outside the component */
    submit: () => askConfirm(),
  });

  onMounted(() => {
    if (props.validateOnLoad) {
      // https://vuetifyjs.com/en/components/forms/#exposed-properties
      formRef.value?.validate();
    }
  });

  // load data async on created
  await onLoad();
</script>
<template>
  <v-form v-model="isValid" :validate-on="props.validateOn" ref="formRef" @submit.prevent="askConfirm">
    <MkToolbar
      v-if="!hideToolbar"
      :loading="inProgress"
      v-bind="$attrs"
      :item-view-id="navigation.currentNavigationItem.value.viewId"
      :title="formTitle"
      :new="false"
      :save="hasSaveHandler"
      :undo="hasUndoHanlder"
      :sticky="props.sticky ? true : false"
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
        <v-btn v-if="hasSaveHandler" variant="flat" :color="saveButtonColor" @click="askConfirm" :disabled="isSaveDisabled">{{ saveButtonLabel }}</v-btn>

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

    <ProblemDetailsComponent v-if="error" :problem-details="error" class="mb-4" :show-details="showProblemDetailsDetailField" />

    <MkConfirmDialog
      v-model="state.saveConfirmDialog"
      :title="saveConfirmationTitle"
      :confirm-button-label="saveButtonLabel"
      :body="saveConfirmationBody"
      @confirm="onSave"
      @cancel="closeConfirmDialog"
    />

    <slot></slot>
  </v-form>
</template>
