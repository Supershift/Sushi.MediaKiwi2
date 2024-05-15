/* eslint-disable @typescript-eslint/no-explicit-any */
/** Preset Validation Rules to be used for the ValidationRule[] for form inputs
 *  @param {string} value - The value of the input field
 *  @param {string} message - Optioanl, the message to be displayed if the validation fails. Otherwiste a default message is shown.
 *  @example const rules: ValidationRule[] = useValidationRules().required('', 'This field is required');
 *  @returns {object} { required, min, max, email, numeric }
 */
export const useValidationRules = () => {
  /** value is required */
  const required = (value: any, message?: string) => !!value || (message ?? "This value is required");
  /** minimum value length required*/
  const minLength = (value: string, min: number, message?: string) => value.length >= min || (message ?? `Value must be at least ${maxLength} characters`);
  /** maximum value length allowed */
  const maxLength = (value: string, max: number, message?: string) => value.length <= max || (message ?? `Value must not be longer than ${max} characters`);
  /** value must be a valid email address */
  const email = (value: string, message?: string) => /.+@.+\..+/.test(value) || (message ?? "This is not a valid e-mail adress");
  /** value must be numeric */
  const numeric = (value: string, message?: string) => /^\d+$/.test(value) || (message ?? "Only numbers are allowed");
  /** minimum value of number */
  const minValue = (value: number, min: number, message?: string) => value >= min || (message ?? `Only values greater than or equal to ${min} are allowed`);
  /** value must be alphanumeric character, whitespace allowed */
  const alphaNumericWithSpace = (value: string, message?: string) =>
    /^[a-zA-Z0-9_\s]*$/.test(value) || (message ?? "Only alpha-numeric characters and space are allowed");
  /** value must be alphanumeric character, no whitespace allowed */
  const alphaNumericNoSpace = (value: string, message?: string) => /^\w+$/.test(value) || (message ?? "Only alpha-numeric characters are allowed");

  return { required, minLength, maxLength, email, numeric, minValue, alphaNumericWithSpace, alphaNumericNoSpace };
};
