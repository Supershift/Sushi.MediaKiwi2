import { useErrorMessages } from "./useErrorMessages";

/**
 * Preset Validation Rules to be used for the ValidationRule[] for form inputs
 * @param {string} value - The value of the input field
 * @param {string} message - Optioanl, the message to be displayed if the validation fails. Otherwiste a default message is shown.
 * @example const rules: ValidationRule[] = useValidationRules().required('', 'This field is required');
 * @returns {object} { required, min, max, email, numeric }
 */
export const useValidationRules = async () => {
  const {
    requiredMessage,
    minLengthMessage,
    maxLengthMessage,
    minMaxLengthMessage,
    emailMessage,
    numericMessage,
    alphaNumericMessage,
    outOfRangeMessage,
    lessThanMessage,
    greaterThanMessage,
  } = await useErrorMessages();

  /** Value is required */
  const required = (value: any, message?: string) => !!value || (message ?? requiredMessage);

  /** Value must be a minimum length */
  const minLength = (minLength: number, message?: string) => (value?: string) => {
    if (!!value) {
      return value.toString().length >= minLength || (message ?? minLengthMessage(minLength));
    }
    return true; // Allow empty/null values
  };

  /** Value must be a maximum length */
  const maxLength = (maxLength: number, message?: string) => (value?: string) => {
    if (!!value) {
      return value.toString().length <= maxLength || (message ?? maxLengthMessage(maxLength));
    }
    return true; // Allow empty/null values
  };

  /** Value must be between a minimum and maximum length */
  const minMaxLength = (minLength: number, maxLength: number, message?: string) => (value?: string) => {
    if (!!value) {
      return (value.toString().length >= minLength && value.toString().length <= maxLength) || (message ?? minMaxLengthMessage(minLength, maxLength));
    }
    return true; // Allow empty/null values
  };

  /** Value must be a valid email address */
  const email = (value?: string, message?: string) => {
    if (!!value) {
      return /.+@.+\..+/.test(value) || (message ?? emailMessage);
    }
    return true; // Allow empty/null values
  };

  /** Value must be numeric */
  const numeric = (value?: string | number, message?: string) => {
    if (!!value) {
      return /^(-?\d*\.?\d+)$/.test(value?.toString()) || (message ?? numericMessage);
    }
    return true; // Allow empty/null values
  };

  /** Value must be alphanumeric character, whitespace allowed */
  const alphaNumericWithSpace = (value?: string, message?: string) => {
    if (!!value) {
      return /^[a-zA-Z0-9_\s]*$/.test(value) || (message ?? alphaNumericMessage);
    }
    return true; // Allow empty/null values
  };

  /** Value must be alphanumeric character, no whitespace allowed */
  const alphaNumericNoSpace = (value?: string, message?: string) => {
    if (!!value) {
      return /^\w+$/.test(value) || (message ?? alphaNumericMessage);
    }
    return true; // Allow empty/null values
  };

  /** Value must be greater than a specified value */
  const greaterThan = (compareValue: number, message?: string) => (value?: string | number) => {
    if (!!value) {
      //  Convert the value to a number
      const numValue = parseFloat(value.toString());
      return numValue > compareValue || (message ?? greaterThanMessage(compareValue));
    }
    return true; // Allow empty/null values
  };

  /** Value must be less than a specified value */
  const lessThan = (compareValue: number, message?: string) => (value?: string | number) => {
    if (!!value) {
      //  Convert the value to a number
      const numValue = parseFloat(value.toString());
      return numValue < compareValue || (message ?? lessThanMessage(compareValue));
    }
    return true; // Allow empty/null values
  };

  /** Value must be between a minimum and maximum value */
  const between = (minValue: number, maxValue: number, message?: string) => (value?: string | number) => {
    if (!!value) {
      const numValue = parseFloat(value.toString());
      return ((numValue >= minValue && numValue <= maxValue) || message) ?? outOfRangeMessage(minValue, maxValue);
    }
    return true; // Allow empty/null values
  };

  return {
    required,
    minLength,
    maxLength,
    minMaxLength,
    email,
    numeric,
    alphaNumericWithSpace,
    alphaNumericNoSpace,
    greaterThan,
    lessThan,
    between,
  };
};
