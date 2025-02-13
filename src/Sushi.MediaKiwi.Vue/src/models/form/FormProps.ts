import { ErrorProblemDetails } from "../errors/ErrorProblemDetails";
import { TResult } from "./TResult";

export type FormViewProps = FormProps & {
  /** If true, the toolbar will be sticky on top of the page. Defaults to true on MkToolbar */
  stickyToolbar?: boolean;
  /** if true, the toolbar will be hidden */
  hideToolbar?: boolean;
};

export type FormDialogProps = FormProps & {
  /** Width of the dialog */
  width?: string;
  /** Height of the dialog */
  height?: string;
  /** Intro text of the dialog */
  intro?: string;
  /** Close the dialog after submit was succesful */
  closeOnSubmit?: boolean | undefined;
  /** Close event */
  onClose?: () => void;
};

export type FormSideSheetProps = FormProps & {
  /** Width of the dialog */
  width?: string;
  /** Intro text of the dialog */
  intro?: string;
  /** Close the sidesheet after submit was succesful */
  closeOnSubmit?: boolean;
  /** Close event */
  onClose?: () => void;
};

export type FormProps = LoadProps &
  SubmitProps &
  DeleteProps &
  UndoProps & {
    validateOn?: "blur" | "submit" | "input" | "input lazy" | "blur lazy" | "submit lazy" | "lazy input" | "lazy blur" | "lazy submit" | "lazy";
    /** Show the {@link ErrorProblemDetails} detail value */
    showProblemDetailsDetailField?: boolean;
    /** Title of the form */
    title?: string;
    /** Name of the entity that is being used in the form. Used in the snackbar feedback  */
    entryName?: string;
  };

export type LoadProps = {
  /** Callback invoked when the component needs data. */
  onLoad?: (event?: Event) => Promise<TResult<any> | void>;
  /** Perform formvalidation as soon as the form loads */
  validateOnLoad?: boolean;
  /** Snackbar message when {@link onLoad} failed */
  loadFailedSnackbarMessage?: string;
};

export type SubmitProps = {
  /** Callback invoked when the submit button is pressed, giving the user feedback on submit */
  onSubmit?: (event?: Event) => Promise<TResult<any> | void>;
  /** Custom label for the default submit button */
  submitButtonLabel?: string;
  /** Title for the confirmation dialog */
  submitConfirmationTitle?: string;
  /** Body for the confirmation dialog */
  submitConfirmationBody?: string;
  /** Triggers a dialog prompt before submit */
  confirmBeforeSubmit?: boolean;
  /** prevents the snackbar after the submit to be shown */
  hideSubmitSnackbar?: boolean;
  /** Snackbar message when {@link onSubmit} was sucessfull */
  submitSuccessfulSnackbarMessage?: string;
  /** reset the form after a successfull submit */
  resetOnSubmit?: boolean;
  /** Use the save labels, instead of the default Submit labels */
  saveLabels?: boolean;
  /** Use the edit labels, instead of the default Submit labels */
  editLabels?: boolean;
};

export type DeleteProps = {
  /** Callback invoked when the delete button is pressed. */
  onDelete?: (event?: Event) => Promise<TResult<any> | void>;
  /** Custom label for the default delete button */
  deleteButtonLabel?: string;
  /** Title for the confirmation dialog */
  deleteConfirmationTitle?: string;
  /** Body for the confirmation dialog */
  deleteConfirmationBody?: string;
  /** navigateToParent after delete is completed  */
  redirectAfterDelete?: boolean;
  /** prevents the snackbar after the delete to be shown */
  hideDeleteSnackbar?: boolean;
  /** Snackbar message when {@link onDelete} was sucessfull */
  deleteSuccessfullSnackbarMessage?: string;
  /** Snackbar message when {@link onDelete} failed */
  deleteFailedSnackbarMessage?: string;
};

export type UndoProps = {
  /** Callback invoked when the component needs data. */
  onUndo?: (event?: Event) => Promise<TResult<any> | void>;
  /** Hides the undo button */
  hideUndo?: boolean;
  /** Custom label for the default undo button */
  undoButtonLabel?: string;
  /** Snackbar message when undo was sucessfull */
  undoSuccessSnackbarMessage?: string;
  /** Snackbar message when undo failed */
  undoFailedSnackbarMessage?: string;
};

export type FormSlotProps = {
  /** Id of the form */
  form: string;
};
