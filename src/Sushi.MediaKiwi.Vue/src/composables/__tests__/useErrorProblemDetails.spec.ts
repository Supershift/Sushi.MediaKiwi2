import "reflect-metadata";
import { vi, describe, it, expect } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { AxiosError } from "axios";
import { useErrorProblemDetails } from "../useErrorProblemDetails";
import { ErrorProblemDetails } from "@/models";
import { useI18next } from "../useI18next";

// Mock the useI18next composable
vi.mock("@/composables/useI18next");

describe("useErrorProblemDetails", async () => {
  // Create a testing pinia store
  createTestingPinia();

  // Inject the snackbar store
  const { getErrorMessages } = await useErrorProblemDetails();

  beforeEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });

  describe("getErrorMessages", async () => {
    it("should return undefined if errorProblemDetails is null", async () => {
      // Arrange
      const errorProblemDetails = null;

      // Act
      const result = getErrorMessages(errorProblemDetails);

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return an array with the detail if errorProblemDetails has a detail property", async () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{ detail: "Some error detail" };

      // Act
      const result = getErrorMessages(errorProblemDetails);

      // Assert
      expect(result).toEqual(["Some error detail"]);
    });

    it("should return an array with the error message if errorProblemDetails has an error property", async () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{ error: { message: "Some error message" } };

      // Act
      const result = getErrorMessages(errorProblemDetails);

      expect(result).toEqual(["Some error message"]);
    });

    it("should return an array with the error message if errorProblemDetails has an error Array", async () => {
      // Arrange
      const aggregateErrorProblemDetails = <ErrorProblemDetails>{
        type: "AggregateError",
        error: {
          errors: [{ message: "Some error message" }, { message: "Some other message" }],
        },
      };

      // Act
      const result = getErrorMessages(aggregateErrorProblemDetails);

      expect(result).toEqual(["Some error message", "Some other message"]);
    });

    it("should return an array with the error message if errorProblemDetails has an errors Record", async () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{
        error: <Record<string, string[]>>{
          field1: ["Some error message"],
          field2: ["Some other message"],
        },
      };

      // Act
      const result = getErrorMessages(errorProblemDetails);

      expect(result).toEqual(["Some error message", "Some other message"]);
    });

    it("should return an array with the error message if errorProblemDetails has an errors Record", async () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{
        error: {
          errors: ["Some error message", "Some other message"],
        },
      };

      // Act
      const result = getErrorMessages(errorProblemDetails);

      expect(result).toEqual(["Some error message", "Some other message"]);
    });
  });
});
