import "reflect-metadata";
import { vi, describe, it, expect } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { ComponentPublicInstance } from "vue";
import { findParentMkForm } from "../globalErrorHandler";

// Mock the useI18next composable
vi.mock("@/composables/useI18next");

describe("useErrorProblemDetails", async () => {
  // Create a testing pinia store
  createTestingPinia();

  beforeEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });

  describe("findParentMkForm", async () => {
    it("should return the parent MkForm component", async () => {
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

      // Act
      const result = findParentMkForm(component);

      // Assert
      expect(result).toBeDefined();
      expect(result.$options.__name).toEqual("MkForm");
    });

    it("should return the parent MkFormDialog component", async () => {
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

      // Act
      const result = findParentMkForm(component);

      // Assert
      expect(result).toBeDefined();
      expect(result.$options.__name).toEqual("MkFormDialog");
    });

    it("should return the parent MkFormSideSheet component", async () => {
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

      // Act
      const result = findParentMkForm(component);

      // Assert
      expect(result).toBeDefined();
      expect(result.$options.__name).toEqual("MkFormSideSheet");
    });

    it("should return null when no MkForm component found", async () => {
      const component = <ComponentPublicInstance>{
        $parent: null,
      };

      // Act
      const result = findParentMkForm(component);

      // Assert
      expect(result).not.toBeDefined();
    });
  });
});
