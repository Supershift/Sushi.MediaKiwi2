import { FormDialogProps, FormProps, FormSideSheetProps, FormViewProps } from "../form/FormProps";

export type MediaKiwiFormOptions = {
  /** General Form options, applicable on all forms (MkForm, MkFormDialog, MkFormSideSheet) */
  general?: FormProps;
  /** Form options applicable on Form presented in MkForm */
  view?: FormViewProps;
  /** Form options applicable on Form presented in MkFormDialog */
  dialog?: FormDialogProps;
  /** Form options applicable on Form presented in MkFormSideSheet */
  sideSheet?: FormSideSheetProps;
};
