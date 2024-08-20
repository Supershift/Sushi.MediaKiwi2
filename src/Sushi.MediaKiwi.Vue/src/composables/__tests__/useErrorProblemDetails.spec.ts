import "reflect-metadata";
import { vi, describe, it, expect } from "vitest";
import { ErrorProblemDetails, useErrorProblemDetails, useSnackbarStore } from "@/framework";
import { createTestingPinia } from "@pinia/testing";
import { AxiosError } from "axios";
import { ComponentPublicInstance } from "vue";

// Mock the useI18next composable
vi.mock("@/composables/useI18next");

describe("useErrorProblemDetails", async () => {
  // Create a testing pinia store
  createTestingPinia();

  // Inject the snackbar store
  const snackbar = useSnackbarStore();
  const showMessageSpy = vi.spyOn(snackbar, "showMessage");
  const composable = useErrorProblemDetails();

  beforeEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });

  describe("getErrorMessages", () => {
    it("should return undefined if errorProblemDetails is null", () => {
      // Arrange
      const errorProblemDetails = null;
      const { getErrorMessages } = useErrorProblemDetails();

      // Act
      const result = getErrorMessages(errorProblemDetails);

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return an array with the detail if errorProblemDetails has a detail property", () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{ detail: "Some error detail" };
      const { getErrorMessages } = useErrorProblemDetails();

      // Act
      const result = getErrorMessages(errorProblemDetails);

      // Assert
      expect(result).toEqual(["Some error detail"]);
    });

    it("should return an array with the error message if errorProblemDetails has an error property", () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{ error: { message: "Some error message" } };
      const { getErrorMessages } = useErrorProblemDetails();

      // Act
      const result = getErrorMessages(errorProblemDetails);

      expect(result).toEqual(["Some error message"]);
    });

    it("should return an array with the error message if errorProblemDetails has an error Array", () => {
      // Arrange
      const aggregateErrorProblemDetails = <ErrorProblemDetails>{
        type: "AggregateError",
        error: {
          errors: [{ message: "Some error message" }, { message: "Some other message" }],
        },
      };
      const { getErrorMessages } = useErrorProblemDetails();

      // Act
      const result = getErrorMessages(aggregateErrorProblemDetails);

      expect(result).toEqual(["Some error message", "Some other message"]);
    });

    it("should return an array with the error message if errorProblemDetails has an errors Record", () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{
        error: <Record<string, string[]>>{
          field1: ["Some error message"],
          field2: ["Some other message"],
        },
      };
      const { getErrorMessages } = useErrorProblemDetails();

      // Act
      const result = getErrorMessages(errorProblemDetails);

      expect(result).toEqual(["Some error message", "Some other message"]);
    });

    it("should return an array with the error message if errorProblemDetails has an errors Record", () => {
      // Arrange
      const errorProblemDetails = <ErrorProblemDetails>{
        error: {
          errors: ["Some error message", "Some other message"],
        },
      };
      const { getErrorMessages } = useErrorProblemDetails();

      // Act
      const result = getErrorMessages(errorProblemDetails);

      expect(result).toEqual(["Some error message", "Some other message"]);
    });
  });

  describe("toErrorProblemDetails", () => {
    it("should return undefined if error is undefined", async () => {
      // Arrange
      const error = undefined;
      const { toErrorProblemDetails } = useErrorProblemDetails();

      // Act
      const result = await toErrorProblemDetails(error);

      // Assert
      expect(result).toBeDefined();
      expect(result.title).toEqual("Unknown error");
    });

    it("should return an ErrorProblemDetails object with default values if error is not recognized", async () => {
      // Arrange
      const error = {};
      const { toErrorProblemDetails } = useErrorProblemDetails();

      // Act
      const result = await toErrorProblemDetails(error);

      // Assert
      expect(result.title).toEqual("Unknown error");
    });

    it("should return an ErrorProblemDetails object if error is an AxiosError with response data", async () => {
      // Arrange
      const error = new AxiosError();
      error.response = <any>{
        status: 500,
        data: { title: "Internal server error", detail: "An error occurred while processing the request" },
      };

      const { toErrorProblemDetails } = useErrorProblemDetails();

      // Act
      const result = await toErrorProblemDetails(error);

      // Assert
      expect(result).toBeDefined();
      expect(result.detail).toBe("An error occurred while processing the request");
    });

    it("should return an ErrorProblemDetails object if error is an Error object", async () => {
      // Arrange
      const error = new Error("Some error message");
      const { toErrorProblemDetails } = useErrorProblemDetails();

      // Act
      const result = await toErrorProblemDetails(error);

      // Assert
      expect(result.status).toBeUndefined();
      expect(result.title).toBeUndefined();
      expect(result.detail).toBe("Some error message");
      expect(result.error).toBeDefined();
      //   expect(result.error.message).toBe("Some error message");
    });

    it("should return an ErrorProblemDetails object if error is an AxiosError with response blob data", async () => {
      // Arrange

      const error = new AxiosError();
      error.message = "Request failed with status code 500";
      error.request = {
        responseType: "blob",
      };
      error.config = {
        headers: <any>{
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        responseType: "blob",
        method: "post",
      };

      const mockBlob = new Blob(["Some error message"], { type: "application/json" });
      mockBlob.text = vi.fn().mockResolvedValue(JSON.stringify({ title: "Internal server error", detail: "An error occurred while processing the request" }));
      error.response = <any>{
        responseType: "blob",
        data: mockBlob,
      };

      const { toErrorProblemDetails } = useErrorProblemDetails();

      // Act
      const result = await toErrorProblemDetails(error);

      // Assert
      expect(result).toBeDefined();
      expect(result.detail).toBe("An error occurred while processing the request");
    });
  });

  describe("findParentMkForm", () => {
    it("should return the parent MkForm component", () => {
      // Arrange
      const component = <ComponentPublicInstance>{
        $parent: <ComponentPublicInstance>{
          $parent: <ComponentPublicInstance>{
            $parent: <ComponentPublicInstance>{
              $options: {
                __name: "MkForm",
              },
            },
          },
        },
      };
      const { findParentMkForm } = useErrorProblemDetails();

      // Act
      const result = findParentMkForm(component);

      // Assert
      expect(result).toBeDefined();
      expect(result.$options.__name).toEqual("MkForm");
    });

    it("should return the parent MkFormDialog component", () => {
      // Arrange
      const component = <ComponentPublicInstance>{
        $parent: <ComponentPublicInstance>{
          $parent: <ComponentPublicInstance>{
            $parent: <ComponentPublicInstance>{
              $options: {
                __name: "MkFormDialog",
              },
            },
          },
        },
      };
      const { findParentMkForm } = useErrorProblemDetails();

      // Act
      const result = findParentMkForm(component);

      // Assert
      expect(result).toBeDefined();
      expect(result.$options.__name).toEqual("MkFormDialog");
    });

    it("should return the parent MkFormSideSheet component", () => {
      // Arrange
      const component = <ComponentPublicInstance>{
        $parent: <ComponentPublicInstance>{
          $parent: <ComponentPublicInstance>{
            $parent: <ComponentPublicInstance>{
              $options: {
                __name: "MkFormSideSheet",
              },
            },
          },
        },
      };
      const { findParentMkForm } = useErrorProblemDetails();

      // Act
      const result = findParentMkForm(component);

      // Assert
      expect(result).toBeDefined();
      expect(result.$options.__name).toEqual("MkFormSideSheet");
    });

    it("should return null when no MkForm component found", () => {
      const component = <ComponentPublicInstance>{
        $parent: null,
      };

      const { findParentMkForm } = useErrorProblemDetails();

      // Act
      const result = findParentMkForm(component);

      // Assert
      expect(result).not.toBeDefined();
    });
  });
});
