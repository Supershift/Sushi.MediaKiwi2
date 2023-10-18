/** Preset Validation Rules to be used for the ValidationRule[] for form inputs
 *  @param {string} value - The value of the input field
 *  @param {string} message - The message to be displayed if the validation fails
 *  @example const rules: ValidationRule[] = useValidationRules().required('', 'This field is required');
 *  @returns {object} { required, min, max, email, numeric }
 */
export const useValidationRules = () => {
  /** value is required */
  const required = (value: string, message: string) => [() => !!value || message];
  /** minimal value length required*/
  const min = (value: string, min: number, message: string) => [() => value.length >= min || message];
  /** maximum value length allowed */
  const max = (value: string, max: number, message: string) => [() => value.length <= max || message];
  /** value must be a valid email address */
  const email = (value: string, message: string) => [() => /.+@.+\..+/.test(value) || message];
  /** value must be numeric */
  const numeric = (value: string, message: string) => [() => /^\d+$/.test(value) || message];

  return { required, min, max, email, numeric };
};
