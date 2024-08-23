import "reflect-metadata";
import axios from "axios";
import { describe, it, expect } from "vitest";
import { ModelRef, ref } from "vue";
import { ErrorProblemDetails, FormProps, useForm } from "@/framework";
import { FormViewProps } from "@/models/form/FormProps";
import { createTestingPinia } from "@pinia/testing";

// Mock the axios instance
const axiosMock = axios.create();

// Mock the useI18next composable
vi.mock("@/composables/useI18next");

describe("useForm", () => {
  // Create a testing pinia store
  createTestingPinia();

  beforeEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });

  // Create the formRef and other required refs
  const formRef = ref<any>({ reset: vi.fn(), validate: vi.fn() });
  const inProgress = ref<boolean>(false) as ModelRef<boolean>;
  const error = ref<ErrorProblemDetails | null | undefined>() as ModelRef<ErrorProblemDetails | null | undefined>;
  const isValid = ref<boolean>(false) as ModelRef<boolean>;
  const isLoaded = ref<boolean>(false);

  describe("Computed Props", () => {
    it("should return the component prop vaues", async () => {
      // Arrage
      const componentProps = <FormProps>{
        hideUndo: true,
      };
      const defaultProps = <FormViewProps>{
        hideUndo: false,
      };

      // Act
      const { computedProps } = await useForm(() => componentProps, defaultProps, formRef, "formId", inProgress, isValid, error, isLoaded);

      // Assert
      expect(computedProps.value.hideUndo).toBeTruthy();
    });

    it("should return the component prop vaues", async () => {
      // Arrage
      const componentProps = <FormProps>{};
      const defaultProps = <FormViewProps>{
        hideUndo: true,
      };

      // Act
      const { computedProps } = await useForm(() => componentProps, defaultProps, formRef, "formId", inProgress, isValid, error, isLoaded);

      // Assert the expected values
      expect(computedProps.value.hideUndo).toBeTruthy();
    });

    it("should return the entry name", async () => {
      // Arrage
      const componentProps = <FormProps>{
        entryName: "Market",
      };
      const defaultProps = <FormViewProps>{};

      // Act
      const { computedProps, submitSuccessMessage } = await useForm(
        () => componentProps,
        defaultProps,
        formRef,
        "formId",
        inProgress,
        isValid,
        error,
        isLoaded
      );

      // Assert
      expect(computedProps.value.entryName).toBe("Market");
      expect(submitSuccessMessage.value).toContain("Market");
    });
  });

  describe("FormProps", () => {
    it("should return the formSlotProps", async () => {
      // Arrage
      const componentProps = <FormProps>{};
      const defaultProps = <FormViewProps>{};

      // Act
      const { formSlotProps } = await useForm(() => componentProps, defaultProps, formRef, "formId", inProgress, isValid, error, isLoaded);

      // Assert the expected values
      expect(formSlotProps.value.form).toBe("formId");
    });
  });
});
