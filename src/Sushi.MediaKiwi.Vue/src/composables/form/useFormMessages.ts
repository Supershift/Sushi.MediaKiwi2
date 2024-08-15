import { useI18next } from "../useI18next";

export async function useFormMessages() {
  const { t } = await useI18next("FormMessages");

  // Load Labels
  const loadFailedSnackbarMessage = (entitiyName: string) =>
    t.value("LoadFailed", "Failed to load {{message.entitiyName}}", { message: { entitiyName } }).toString();

  // Undo Labels
  const undoSuccessSnackbarMessage = () => t.value("UndoSuccessful", "Changes reverted").toString();
  const undoFailedSnackbarMessage = () => t.value("UndoFailed", "Failed to revert changes").toString();
  const undoButtonLabel = () => t.value("UndoChanges", "Undo changes");

  // Delete labels
  const deleteButtonLabel = () => t.value("Delete");
  const deleteConfirmationTitle = (entitiyName: string) =>
    t.value("DeleteConfirmTitle", "Delete this {{message.entitiyName}}", { message: { entitiyName } }).toString();

  const deleteConfirmationBody = (entitiyName: string) =>
    t.value("DeleteConfirmBody", "Are you sure you want to delete this {{message.entitiyName}} permanently?", { message: { entitiyName } }).toString();

  const deleteSuccessfulMessage = (entitiyName: string) =>
    t.value("DeleteSuccessful", "Successfully deleted the {{message.entitiyName}}", { message: { entitiyName } }).toString();

  const deleteFailedMessage = (entitiyName: string) =>
    t.value("DeleteFailed", "Failed to delete the {{message.entitiyName}}", { message: { entitiyName } }).toString();

  // Submit labels
  const submitButtonLabel = () => t.value("Submit");
  const submitConfirmationTitle = (entitiyName: string) => t.value("SubmitConfirmTitle", "Submit this {{message.entitiyName}}", { message: { entitiyName } });
  const submitConfirmationBody = (entitiyName: string) =>
    t.value("SubmitConfirmBody", "Are you sure you want to submit this {{message.entitiyName}}?", { message: { entitiyName } });
  const submitSuccessMessage = (entitiyName: string) =>
    t.value("SubmitSuccessful", "Successfully submitted the {{message.entitiyName}}", { message: { entitiyName } }).toString();

  // Save
  const saveButtonLabel = () => t.value("Save");
  const saveConfirmationTitle = (entitiyName: string) => t.value("SaveConfirmTitle", "Save this {{message.entitiyName}}", { message: { entitiyName } });
  const saveConfirmationBody = (entitiyName: string) =>
    t.value("SaveConfirmBody", "Are you sure you want to save this {{message.entitiyName}}?", { message: { entitiyName } });
  const saveSuccessMessage = (entitiyName: string) =>
    t.value("SaveSuccessful", "Successfully saved the {{message.entitiyName}}", { message: { entitiyName } }).toString();

  // Edit labels
  const editConfirmationTitle = (entitiyName: string) => t.value("EditConfirmTitle", "Edit this {{message.entitiyName}}", { message: { entitiyName } });
  const editConfirmationBody = (entitiyName: string) =>
    t.value("EditConfirmBody", "Are you sure you want to edit this {{message.entitiyName}}?", { message: { entitiyName } });
  const editSuccessMessage = (entitiyName: string) =>
    t.value("EditSuccessful", "Successfully edited the {{message.entitiyName}}", { message: { entitiyName } }).toString();

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
