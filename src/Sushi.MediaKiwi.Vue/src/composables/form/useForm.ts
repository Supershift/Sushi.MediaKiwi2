import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { ModelRef, Ref, computed } from "vue";
import { FormDialogProps, FormViewProps, FormSideSheetProps, FormSlotProps, SubmitProps } from "@/models/form";
import { useFormLoad } from "./useFormLoad";
import { useFormSubmit } from "./useFormSubmit";
import { useFormDelete } from "./useFormDelete";

export async function useForm<T extends FormViewProps | FormDialogProps | FormSideSheetProps>(
  /** Props set on the implementing component */
  componentProps: () => Partial<T>,
  /** Default props set on the Form Component(s) or through the main configuration */
  defaultProps: T,
  /** Ref to the Form element */
  formRef: Ref<any>,
  /** Custom id for the Form Element */
  formId: string,
  /** Model for the Progress state of the component */
  inProgress: ModelRef<boolean, string>,
  /** Model for the Valid state of the component */
  isValid: ModelRef<any, string>,
  /** Model for the errorProblemDetails state of the component */
  errorProblemDetails: ModelRef<ErrorProblemDetails | null | undefined, string>
) {
  // Helper function to filter out undefined properties
  const definedProps = (obj: Partial<T>) => Object.fromEntries(Object.entries(obj).filter(([_k, v]) => !!v));

  /** Computed properties for the Form, merging the defaultProps with the form props */
  const computedProps = computed<T>(() => {
    // Get the props from the component
    const props = componentProps();

    // Merge the defaultProps with the form props, overriding the defaults with the component props
    const computedProps = { ...defaultProps, ...definedProps(props) };

    // Return the computed props
    return computedProps;
  });

  // Init the form load, submit and delete functions
  const formLoad = await useFormLoad(computedProps, formRef, inProgress, errorProblemDetails);
  const formSubmit = await useFormSubmit(computedProps, formRef, formId, inProgress, isValid, errorProblemDetails);
  const formDelete = await useFormDelete(computedProps, inProgress, errorProblemDetails);

  /**
   * Slot props for the form, to be passed to a component implementing a Form
   */
  const formSlotProps = computed<FormSlotProps>(() => {
    return <FormSlotProps>{
      form: formId,
    };
  });

  return {
    ...formLoad,
    ...formSubmit,
    ...formDelete,
    computedProps,
    formSlotProps,
  };
}
