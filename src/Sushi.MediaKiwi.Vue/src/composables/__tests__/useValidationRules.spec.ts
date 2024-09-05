import "reflect-metadata";
import { describe, it, expect } from "vitest";
import { useValidationRules } from "../useValidationRules";

// Mock the useI18next composable
vi.mock("@/composables/useI18next");

describe("useValidationRules", async () => {
  const { required, minLength, maxLength, email, numeric, alphaNumericNoSpace, alphaNumericWithSpace, greaterThan, lessThan, between, minMaxLength } =
    await useValidationRules();

  describe("Validation", () => {
    it("should validate a required field", () => {
      expect(required("")).toBe("This field is required.");
      expect(required("Some value")).toBe(true);
    });

    it("should validate the minimum value length", () => {
      expect(minLength(5)("abc")).toBe("The input must be more than 5 characters long.");
      expect(minLength(5)("abcdef")).toBe(true);
      expect(minLength(5)("")).toBe(true);

      expect(minLength(5)(<any>99)).toBe("The input must be more than 5 characters long.");
      expect(minLength(5)(<any>99999)).toBe(true);
      expect(minLength(5)()).toBe(true);
    });

    it("should validate the maximum value length", () => {
      expect(maxLength(10)("abcdefghijk")).toBe("The input must be at least 10 characters long.");
      expect(maxLength(10)("abcde")).toBe(true);
      expect(maxLength(10)("")).toBe(true);

      expect(maxLength(2)(<any>999)).toBe("The input must be at least 2 characters long.");
      expect(maxLength(2)(<any>99)).toBe(true);
      expect(maxLength(2)()).toBe(true);
    });

    it("should validate the min and max length", () => {
      expect(minMaxLength(5, 10)("abc")).toBe("The input must be between 5 and 10 characters long.");
      expect(minMaxLength(5, 10)("abcdefghijk")).toBe("The input must be between 5 and 10 characters long.");
      expect(minMaxLength(5, 10)("abcdef")).toBe(true);
      expect(minMaxLength(5, 10)("")).toBe(true);

      expect(minMaxLength(5, 10)(<any>999)).toBe("The input must be between 5 and 10 characters long.");
      expect(minMaxLength(5, 10)(<any>99999999999)).toBe("The input must be between 5 and 10 characters long.");
      expect(minMaxLength(5, 10)(<any>999999)).toBe(true);
      expect(minMaxLength(5, 10)()).toBe(true);
    });

    it("should validate that a value is a valid email address", () => {
      expect(email("notanemail")).toBe("Enter a valid email address.");
      expect(email("test@supershift.nl")).toBe(true);
      expect(email()).toBe(true);
    });

    it("should validate that a value is numeric", () => {
      expect(numeric("123abc")).toBe("Enter a valid numeric value.");
      expect(numeric("123")).toBe(true);
      expect(numeric(123)).toBe(true);
      expect(numeric()).toBe(true);
    });

    it("Should validate alpha-numeric characters", () => {
      expect(alphaNumericNoSpace("123 abc")).toBe("The input contains unsupported characters. Please remove any special characters and/or symbols.");
      expect(alphaNumericNoSpace("abc@")).toBe("The input contains unsupported characters. Please remove any special characters and/or symbols.");
      expect(alphaNumericNoSpace("abc")).toBe(true);
      expect(alphaNumericNoSpace("123")).toBe(true);
      expect(alphaNumericNoSpace("123abc")).toBe(true);
      expect(alphaNumericNoSpace()).toBe(true);
    });

    it("Should only allow alpha-numeric characters with whitespace", () => {
      expect(alphaNumericWithSpace("abc@")).toBe("The input contains unsupported characters. Please remove any special characters and/or symbols.");
      expect(alphaNumericWithSpace("abc")).toBe(true);
      expect(alphaNumericWithSpace("123")).toBe(true);
      expect(alphaNumericWithSpace("123abc")).toBe(true);
      expect(alphaNumericWithSpace("123 abc")).toBe(true);
      expect(alphaNumericWithSpace()).toBe(true);
    });

    it("Should validate that a value is between a minimum and maximum value", () => {
      expect(between(5, 10)("abc")).toBe("The value must be between 5 and 10.");
      expect(between(5, 10)("abcdef")).toBe("The value must be between 5 and 10.");
      expect(between(5, 10)("6")).toBe(true);
      expect(between(5, 10)(6)).toBe(true);
      expect(between(5, 10)()).toBe(true);
    });

    it("Should validate that a value is greater than a minimum value", () => {
      expect(greaterThan(5)("abc")).toBe("The value must be greater than 5.");
      expect(greaterThan(5)("abcdef")).toBe("The value must be greater than 5.");
      expect(greaterThan(5)("4")).toBe("The value must be greater than 5.");
      expect(greaterThan(5)(4)).toBe("The value must be greater than 5.");
      expect(greaterThan(5)("6")).toBe(true);
      expect(greaterThan(5)(6)).toBe(true);
      expect(greaterThan(5)()).toBe(true);
    });

    it("Should validate that a value is less than a maximum value", () => {
      expect(lessThan(5)("abc")).toBe("The value must be less than 5.");
      expect(lessThan(5)("abcdef")).toBe("The value must be less than 5.");
      expect(lessThan(5)("6")).toBe("The value must be less than 5.");
      expect(lessThan(5)(6)).toBe("The value must be less than 5.");
      expect(lessThan(5)("4")).toBe(true);
      expect(lessThan(5)(4)).toBe(true);
      expect(lessThan(5)()).toBe(true);
    });
  });

  describe("Custom messages", () => {
    it("should validate that a value is required", () => {
      const message = "This field is required";
      expect(required("", message)).toBe(message);
    });

    it("should validate the minimum value length", () => {
      const message = "Minimum length is 5";
      expect(minLength(5, message)("abc")).toBe(message);
    });

    it("should validate the maximum value length", () => {
      const message = "Maximum length is 10";
      expect(maxLength(10, message)("abcdefghijk")).toBe(message);
    });

    it("should validate that a value is a valid email address", () => {
      const message = "Invalid email address";
      expect(email("notanemail", message)).toBe(message);
    });

    it("should validate that a value is numeric", () => {
      const message = "Value must be numeric";
      expect(numeric("123abc", message)).toBe(message);
    });

    it("Should only allow alpha-numeric characters", () => {
      const message = "Only alpha-numeric characters are allowed";
      expect(alphaNumericNoSpace("abc@", message)).toBe(message);
    });

    it("Should only allow alpha-numeric characters and whitespace", () => {
      const message = "Only alpha-numeric characters are allowed";
      expect(alphaNumericWithSpace("abc@", message)).toBe(message);
    });

    it("Should validate that a value is between a minimum and maximum value", () => {
      const message = "Value must be between 5 and 10";
      expect(between(5, 10, message)("abc")).toBe(message);
    });

    it("Should validate that a value is greater than a minimum value", () => {
      const message = "Value must be greater than 5";
      expect(greaterThan(5, message)("abc")).toBe(message);
    });

    it("Should validate that a value is less than a maximum value", () => {
      const message = "Value must be less than 5";
      expect(lessThan(5, message)("abc")).toBe(message);
    });
  });
});
