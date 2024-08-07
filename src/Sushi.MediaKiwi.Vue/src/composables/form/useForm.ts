import { ProblemDetails } from "@/models/errors/ProblemDetails";
import { ModelRef, Ref, computed, onMounted } from "vue";
import { useI18next as useI18nextComposable } from "./../useI18next";
import { FormDialogProps, FormViewProps, FormSideSheetProps } from "@/models/form";
import { useFormLoad } from "./useFormLoad";
import { useFormSubmit } from "./useFormSubmit";
import { useFormDelete } from "./useFormDelete";

export async function useForm<T extends FormViewProps | FormDialogProps | FormSideSheetProps>(
  useI18next: ReturnType<typeof useI18nextComposable>,
  componentProps: () => Partial<T>,
  inProgress: ModelRef<boolean, string>,
  isValid: ModelRef<any, string>,
  problemDetails: ModelRef<ProblemDetails | null | undefined, string>,
  formRef: Ref<any>,
  defaultProps: T,
  formId: string
) {
  // Helper function to filter out undefined properties
  const definedProps = (obj: Partial<T>) => Object.fromEntries(Object.entries(obj).filter(([_k, v]) => !!v));

  // Reactive Model
  const computedProps = computed<T>(() => {
    // Get the computedProps
    const props = componentProps();

    // Merge the defaultProps with the form props
    const computedProps = { ...defaultProps, ...definedProps(props) };
    return computedProps;
  });

  const formLoad = await useFormLoad(useI18next, computedProps, inProgress, problemDetails, formRef);
  const formSubmit = await useFormSubmit(useI18next, computedProps, inProgress, isValid, problemDetails, formRef, formId);
  const formDelete = await useFormDelete(useI18next, computedProps, inProgress, problemDetails);

  return {
    ...formLoad,
    ...formSubmit,
    ...formDelete,
    computedProps,
  };
}
