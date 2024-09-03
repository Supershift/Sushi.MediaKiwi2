import { FormMessages } from "@/models/form/FormMessages";
import { useI18next } from "../useI18next";

export async function useFormMessages(): Promise<FormMessages> {
  const { t } = await useI18next("ErrorMessages");

  // Load Labels
  const loadFailedSnackbarMessage = (entryName: string) => t.value("LoadFailed", "Failed to load {{message.entryName}}", { message: { entryName } }).toString();

  // Undo Labels
  const undoSuccessSnackbarMessage = () => t.value("UndoSuccessful", "Changes reverted").toString();
  const undoFailedSnackbarMessage = () => t.value("UndoFailed", "Failed to revert changes").toString();
  const undoButtonLabel = () => t.value("UndoChanges", "Undo changes");

  // Delete labels
  const deleteButtonLabel = () => t.value("Delete");
  const deleteConfirmationTitle = (entryName: string) =>
    t.value("DeleteConfirmTitle", "Delete this {{message.entryName}}", { message: { entryName } }).toString();

  const deleteConfirmationBody = (entryName: string) =>
    t.value("DeleteConfirmBody", "Are you sure you want to delete this {{message.entryName}}?", { message: { entryName } }).toString();

  const deleteSuccessfulMessage = (entryName: string) =>
    t.value("DeleteSuccessful", "Successfully deleted the {{message.entryName}}", { message: { entryName } }).toString();

  const deleteFailedMessage = (entryName: string) =>
    t.value("DeleteFailed", "Failed to delete the {{message.entryName}}", { message: { entryName } }).toString();

  // Submit labels
  const submitButtonLabel = () => t.value("Submit");
  const submitConfirmationTitle = (entryName: string) => t.value("SubmitConfirmTitle", "Submit this {{message.entryName}}", { message: { entryName } });
  const submitConfirmationBody = (entryName: string) =>
    t.value("SubmitConfirmBody", "Are you sure you want to submit this {{message.entryName}}?", { message: { entryName } });
  const submitSuccessMessage = (entryName: string) =>
    t.value("SubmitSuccessful", "Successfully submitted the {{message.entryName}}", { message: { entryName } }).toString();

  // Save
  const saveButtonLabel = () => t.value("Save");
  const saveConfirmationTitle = (entryName: string) => t.value("SaveConfirmTitle", "Save this {{message.entryName}}", { message: { entryName } });
  const saveConfirmationBody = (entryName: string) =>
    t.value("SaveConfirmBody", "Are you sure you want to save this {{message.entryName}}?", { message: { entryName } });
  const saveSuccessMessage = (entryName: string) =>
    t.value("SaveSuccessful", "Successfully saved the {{message.entryName}}", { message: { entryName } }).toString();

  // Edit labels
  const editConfirmationTitle = (entryName: string) => t.value("EditConfirmTitle", "Edit this {{message.entryName}}", { message: { entryName } });
  const editConfirmationBody = (entryName: string) =>
    t.value("EditConfirmBody", "Are you sure you want to edit this {{message.entryName}}?", { message: { entryName } });
  const editSuccessMessage = (entryName: string) =>
    t.value("EditSuccessful", "Successfully edited the {{message.entryName}}", { message: { entryName } }).toString();

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
