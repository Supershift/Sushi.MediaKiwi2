import { describe, it, expect } from "vitest";
import { useValidationRules } from "../useValidationRules";

describe("useValidationRules", () => {
  const { required, minLength, maxLength, email, numeric, alphaNumericNoSpace, alphaNumericWithSpace } = useValidationRules();

  it("should validate that a value is required", () => {
    const message = "This field is required";
    expect(required("", message)).toBe(message);
    expect(required("Some value", message)).toBe(true);
  });

  it("should validate the minimum value length", () => {
    const message = "Minimum length is 5";
    expect(minLength("abc", 5, message)).toBe(message);
    expect(minLength("abcdef", 5, message)).toBe(true);
  });

  it("should validate the maximum value length", () => {
    const message = "Maximum length is 10";
    expect(maxLength("abcdefghijk", 10, message)).toBe(message);
    expect(maxLength("abcde", 10, message)).toBe(true);
  });

  it("should validate that a value is a valid email address", () => {
    const message = "Invalid email address";
    expect(email("notanemail", message)).toBe(message);
    expect(email("test@example.com", message)).toBe(true);
  });

  it("should validate that a value is numeric", () => {
    const message = "Value must be numeric";
    expect(numeric("123abc", message)).toBe(message);
    expect(numeric("123", message)).toBe(true);
  });

  it("Should only allow alpha-numeric characters", () => {
    const message = "Only alpha-numeric characters are allowed";
    expect(alphaNumericNoSpace("abc", message)).toBe(true);
    expect(alphaNumericNoSpace("123", message)).toBe(true);
    expect(alphaNumericNoSpace("123abc", message)).toBe(true);
    expect(alphaNumericNoSpace("123 abc", message)).toBe(message);
    expect(alphaNumericNoSpace("abc@", message)).toBe(message);
  });

  it("Should only allow alpha-numeric characters and whitespace", () => {
    const message = "Only alpha-numeric characters are allowed";
    expect(alphaNumericWithSpace("abc", message)).toBe(true);
    expect(alphaNumericWithSpace("123", message)).toBe(true);
    expect(alphaNumericWithSpace("123abc", message)).toBe(true);
    expect(alphaNumericWithSpace("123 abc", message)).toBe(true);
    expect(alphaNumericWithSpace("abc@", message)).toBe(message);
  });
});
