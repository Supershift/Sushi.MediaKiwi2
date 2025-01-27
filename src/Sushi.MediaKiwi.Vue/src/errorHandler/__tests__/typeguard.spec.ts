import "reflect-metadata";
import { describe, it, expect } from "vitest";
import { isError, isApiError, isApiErrorArray, isStringArray, IsErrorProblemDetails } from "../typeguards";
import { ApiError } from "@/models";

describe("Type guard functions", () => {
  describe("isError", () => {
    it("should return true when given an Error object", () => {
      // Arrange
      const error = new Error("Test error");

      // Act
      const result = isError(error);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("isApiError", () => {
    // Add test cases for isApiError function
    it("should return true when given an ApiError object", () => {
      // Arrange
      const error = <ApiError>{ message: "Test error" };

      // Act
      const result = isApiError(error);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("isApiErrorArray", () => {
    // Add test cases for isApiErrorArray function
    it("should return true when given an array of ApiError objects", () => {
      // Arrange
      const error = [<ApiError>{ message: "Test error" }];

      // Act
      const result = isApiErrorArray(error);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("isStringArray", () => {
    // Add test cases for isStringArray function
    it("should return true when given an array of strings", () => {
      // Arrange
      const error = ["Test error"];

      // Act
      const result = isStringArray(error);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("IsErrorProblemDetails", () => {
    // Add test cases for IsErrorProblemDetails function
    it("should return true when given an ErrorProblemDetails object", () => {
      // Arrange
      const error = { detail: "Test error" };

      // Act
      const result = IsErrorProblemDetails(error);

      // Assert
      expect(result).toBe(true);
    });
  });
});
