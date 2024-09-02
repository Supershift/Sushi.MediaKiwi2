import { FormMessages } from "@/models/form/FormMessages";
import { useI18next as useI18nextComposable } from "./../useI18next";

// SHOULD BE FORM LABELS
export async function useFormMessages(useI18next: ReturnType<typeof useI18nextComposable>): Promise<FormMessages> {
  const { i18next } = await useI18next;

  // Load Labels
  const loadFailedSnackbarMessage = (entryName: string) =>
    i18next.value.t("LoadFailed", "Failed to load {{message.entryName}}", { message: { entryName } }).toString();

  // Undo Labels
  const undoSuccessSnackbarMessage = () => i18next.value.t("UndoSuccessful", "Changes reverted").toString();
  const undoFailedSnackbarMessage = () => i18next.value.t("UndoFailed", "Failed to revert changes").toString();
  const undoButtonLabel = () => i18next.value.t("UndoChanges", "Undo changes");

  // Delete labels
  const deleteButtonLabel = () => i18next.value.t("Delete");
  const deleteConfirmationTitle = (entryName: string) =>
    i18next.value.t("DeleteConfirmTitle", "Delete this {{message.entryName}}", { message: { entryName } }).toString();

  const deleteConfirmationBody = (entryName: string) =>
    i18next.value.t("DeleteConfirmBody", "Are you sure you want to delete this {{message.entryName}}?", { message: { entryName } }).toString();

  const deleteSuccessfulMessage = (entryName: string) =>
    i18next.value.t("DeleteSuccessful", "Successfully deleted the {{message.entryName}}", { message: { entryName } }).toString();

  const deleteFailedMessage = (entryName: string) =>
    i18next.value.t("DeleteFailed", "Failed to delete the {{message.entryName}}", { message: { entryName } }).toString();

  // Submit labels
  const submitButtonLabel = () => i18next.value.t("Submit");
  const submitConfirmationTitle = (entryName: string) => i18next.value.t("SubmitConfirmTitle", "Submit this {{message.entryName}}", { message: { entryName } });
  const submitConfirmationBody = (entryName: string) =>
    i18next.value.t("SubmitConfirmBody", "Are you sure you want to submit this {{message.entryName}}?", { message: { entryName } });
  const submitSuccessMessage = (entryName: string) =>
    i18next.value.t("SubmitSuccessful", "Successfully submitted the {{message.entryName}}", { message: { entryName } }).toString();

  // Save
  const saveButtonLabel = () => i18next.value.t("Save");
  const saveConfirmationTitle = (entryName: string) => i18next.value.t("SaveConfirmTitle", "Save this {{message.entryName}}", { message: { entryName } });
  const saveConfirmationBody = (entryName: string) =>
    i18next.value.t("SaveConfirmBody", "Are you sure you want to save this {{message.entryName}}?", { message: { entryName } });
  const saveSuccessMessage = (entryName: string) =>
    i18next.value.t("SaveSuccessful", "Successfully saved the {{message.entryName}}", { message: { entryName } }).toString();

  // Edit labels
  const editConfirmationTitle = (entryName: string) => i18next.value.t("EditConfirmTitle", "Edit this {{message.entryName}}", { message: { entryName } });
  const editConfirmationBody = (entryName: string) =>
    i18next.value.t("EditConfirmBody", "Are you sure you want to edit this {{message.entryName}}?", { message: { entryName } });
  const editSuccessMessage = (entryName: string) =>
    i18next.value.t("EditSuccessful", "Successfully edited the {{message.entryName}}", { message: { entryName } }).toString();

  return {
    loadFailedSnackbarMessage,
    undoSuccessSnackbarMessage,
    undoFailedSnackbarMessage,
    undoButtonLabel,
    deleteButtonLabel,
    deleteConfirmationTitle,
    deleteConfirmationBody,
    deleteSuccessfulMessage,
    deleteFailedMessage,
    submitButtonLabel,
    submitConfirmationTitle,
    submitConfirmationBody,
    submitSuccessMessage,
    saveButtonLabel,
    saveConfirmationTitle,
    saveConfirmationBody,
    saveSuccessMessage,
    editConfirmationTitle,
    editConfirmationBody,
    editSuccessMessage,
  };
}
