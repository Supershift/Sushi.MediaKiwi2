export type FormMessages = {
  // Load
  loadFailedSnackbarMessage: (entryName: string) => string;

  // Undo
  undoSuccessSnackbarMessage: () => string;
  undoFailedSnackbarMessage: () => string;
  undoButtonLabel: () => string;

  // Delete
  deleteButtonLabel: () => string;
  deleteConfirmationTitle: (entryName: string) => string;
  deleteConfirmationBody: (entryName: string) => string;
  deleteSuccessfulMessage: (entryName: string) => string;
  deleteFailedMessage: (entryName: string) => string;

  // Submit
  submitButtonLabel: () => string;
  submitConfirmationTitle: (entryName: string) => string;
  submitConfirmationBody: (entryName: string) => string;
  submitSuccessMessage: (entryName: string) => string;

  // Save
  saveButtonLabel: () => string;
  saveConfirmationTitle: (entryName: string) => string;
  saveConfirmationBody: (entryName: string) => string;
  saveSuccessMessage: (entryName: string) => string;

  // Edit
  editConfirmationTitle: (entryName: string) => string;
  editConfirmationBody: (entryName: string) => string;
  editSuccessMessage: (entryName: string) => string;
};
