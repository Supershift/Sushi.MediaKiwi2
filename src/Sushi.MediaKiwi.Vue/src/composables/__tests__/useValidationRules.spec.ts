import { describe, it, expect } from "vitest";
import { useValidationRules } from "../useValidationRules";

describe("useValidationRules", () => {
  const { required, min, max, email, numeric } = useValidationRules();

  it("should validate that a value is required", () => {
    const message = "This field is required";
    expect(required("", message)[0]()).toBe(message);
    expect(required("Some value", message)[0]()).toBe(true);
  });

  it("should validate the minimum value length", () => {
    const message = "Minimum length is 5";
    expect(min("abc", 5, message)[0]()).toBe(message);
    expect(min("abcdef", 5, message)[0]()).toBe(true);
  });

  it("should validate the maximum value length", () => {
    const message = "Maximum length is 10";
    expect(max("abcdefghijk", 10, message)[0]()).toBe(message);
    expect(max("abcde", 10, message)[0]()).toBe(true);
  });

  it("should validate that a value is a valid email address", () => {
    const message = "Invalid email address";
    expect(email("notanemail", message)[0]()).toBe(message);
    expect(email("test@example.com", message)[0]()).toBe(true);
  });

  it("should validate that a value is numeric", () => {
    const message = "Value must be numeric";
    expect(numeric("123abc", message)[0]()).toBe(message);
    expect(numeric("123", message)[0]()).toBe(true);
  });
});
