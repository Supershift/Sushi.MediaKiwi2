import "reflect-metadata";
import axios from "axios";
import { describe, it, expect, vi } from "vitest";
import { ref, computed, ModelRef } from "vue";
import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { TResult } from "@/models/form/TResult";
import { useFormLoad } from "./../useFormLoad";
import { createTestingPinia } from "@pinia/testing";
import { LoadProps, UndoProps } from "@/models/form/FormProps";
import { registerInterceptor } from "@/services/axios/interceptor";
import { useFormMessages } from "@/framework";

// Mock the axios instance
const axiosMock = axios.create();

// Mock the useI18next composable
vi.mock("@/composables/useI18next");

describe("useFormLoad", async () => {
  beforeEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });

  // Create a testing pinia store
  createTestingPinia();

  const formMessages = await useFormMessages();

  // Register the axios interceptor
  registerInterceptor(axiosMock);

  const formRef = ref<any>({ reset: vi.fn(), validate: vi.fn() });
  const entityName = ref<string>("Market");
  const entityLabel = computed<string>(() => entityName.value);
  const inProgress = ref<boolean>(false) as ModelRef<boolean>;
  const error = ref<ErrorProblemDetails | null | undefined>() as ModelRef<ErrorProblemDetails | null | undefined>;
  const isLoaded = ref<boolean>(false);

  // Arrange
  const props = computed<LoadProps & UndoProps>(() => ({
    onLoad: undefined,
    onUndo: undefined,
  }));

  // Spy
  const inProgressSpy = vi.spyOn(inProgress, "value", "set");
  const errorSpy = vi.spyOn(error, "value", "set");
  const isLoadingSpy = vi.spyOn(isLoaded, "value", "set");

  const useFormLoadInstance = await useFormLoad(props, formRef, entityLabel, inProgress, error, isLoaded, formMessages);

  describe("onLoad handler", () => {
    it("should tell when no load handler is present", async () => {
      // Act
      const { hasLoadHandler, hasUndoHandler } = await useFormLoad(props, formRef, entityLabel, inProgress, error, isLoaded, formMessages);

      // Assert
      expect(hasLoadHandler.value).toBeFalsy();
      expect(hasUndoHandler.value).toBeFalsy();
    });

    it("should call onLoad handler and return success result", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockResolvedValueOnce(TResult.success({ id: 1, name: "Market 1" }));

      // Act
      const result = await useFormLoadInstance.onLoad();

      // Assert
      expect(useFormLoadInstance.hasLoadHandler).toBeTruthy();
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(isLoadingSpy).toHaveBeenCalledWith(true);
      expect(inProgressSpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual(TResult.success());
    });

    it("should call onLoad handler to handle an error result", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockImplementationOnce(() => {
        throw new Error("Failed to load data");
      });

      // Act
      await useFormLoadInstance.onLoad();

      // Assert
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });

    it("should call onLoad handler to handle an axios error result", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockImplementationOnce(async () => {
        return await axiosMock.get("/mocked-endpoint");
      });

      // Act
      const result = await useFormLoadInstance.onLoad();

      // Assert
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledTimes(2); // One to clear the error and one to set the error
      expect(result.isSuccess).toEqual(false);
    });

    it("should handle and show an error message after successful submission", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockImplementationOnce(() => {
        return TResult.failure(new ErrorProblemDetails("Submit succeeded, but there was an expected sub error"));
      });

      // Act
      await useFormLoadInstance.onLoad();

      // Assert the function calls
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledTimes(2);
      expect(error.value?.detail).toBe("Submit succeeded, but there was an expected sub error");
    });
  });

  describe("onLoad & onUndo handler", () => {
    const formRef = ref(null);
    const entityName = computed<string>(() => "Market");
    const inProgress = { value: false } as ModelRef<boolean>;
    const error = { value: null } as ModelRef<ErrorProblemDetails | null | undefined>;

    it("should tell when no load handler is present", async () => {
      // Arrange
      props.value.onLoad = undefined;

      // Act
      const { hasUndoHandler } = await useFormLoad(props, formRef, entityName, inProgress, error, isLoaded, formMessages);

      // Assert
      expect(hasUndoHandler.value).toBeFalsy();
    });

    it("should tell when load handler is present but hideUndo is set", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockResolvedValueOnce(TResult.success({ id: 1, name: "Market 1" }));
      props.value.hideUndo = true;

      // Act
      const { hasUndoHandler } = await useFormLoad(props, formRef, entityName, inProgress, error, isLoaded, formMessages);

      // Assert
      expect(hasUndoHandler.value).toBeFalsy();
    });

    it("should call onLoad handler and return success result", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockResolvedValueOnce(TResult.success({ id: 1, name: "Market 1" }));

      // Act
      const result = await useFormLoadInstance.onUndo();

      // Assert
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(inProgressSpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual(TResult.success());
    });

    it("should call onLoad handler to handle an error result", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockImplementationOnce(() => {
        throw new Error("Failed to load data");
      });

      // Act
      await useFormLoadInstance.onUndo();

      // Assert
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });

    it("should call onUndo handler to handle an axios error result", async () => {
      // Arrange
      props.value.onUndo = vi.fn().mockImplementationOnce(async () => {
        return await axiosMock.get("/mocked-endpoint");
      });

      // Act
      const result = await useFormLoadInstance.onUndo();

      // Assert
      expect(props.value.onUndo).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledTimes(2); // One to clear the error and one to set the error
      expect(result.isSuccess).toEqual(false);
    });

    it("Should set isLoaded when no onLoad handler is preset", async () => {
      // Arrange
      props.value.onLoad = undefined;

      // Act
      const { onLoad } = await useFormLoad(props, formRef, entityName, inProgress, error, isLoaded, formMessages);
      await onLoad();

      // Assert
      expect(isLoadingSpy).toHaveBeenCalledWith(true);
    });
  });

  describe("Labels", () => {
    const formRef = ref(null);
    const inProgress = { value: false } as ModelRef<boolean>;
    const error = { value: null } as ModelRef<ErrorProblemDetails | null | undefined>;

    describe("entry name", () => {
      it("should use default entry name", async () => {
        // Arrange
        const entityName = computed<string>(() => "");
        const props = computed<LoadProps & UndoProps>(() => {
          return {};
        });

        // Act
        const { loadFailedSnackbarMessage } = await useFormLoad(props, formRef, entityName, inProgress, error, isLoaded, formMessages);

        // Assert
        expect(loadFailedSnackbarMessage.value).toEqual("Failed to load data");
      });

      it("should use custom entry name", async () => {
        // Arrange
        const entityName = computed<string>(() => "Market");
        const props = computed<LoadProps & UndoProps>(() => {
          return {};
        });

        // Act
        const { loadFailedSnackbarMessage } = await useFormLoad(props, formRef, entityName, inProgress, error, isLoaded, formMessages);

        // Assert
        expect(loadFailedSnackbarMessage.value).toEqual("Failed to load Market");
      });
    });

    it("should use default labels", async () => {
      // Arrange
      const entityName = computed<string>(() => "");
      const props = computed<LoadProps & UndoProps>(() => {
        return {};
      });

      // Act
      const { undoButtonLabel, undoSuccessSnackbarMessage } = await useFormLoad(props, formRef, entityName, inProgress, error, isLoaded, formMessages);

      // Assert
      expect(undoButtonLabel.value).toEqual("Undo changes");
      expect(undoSuccessSnackbarMessage.value).toEqual("Changes reverted");
    });

    it("should use custom labels", async () => {
      // Arrange
      const entityName = computed<string>(() => "Market");
      const props = computed<LoadProps & UndoProps>(() => {
        return {
          undoButtonLabel: "Custom undo text",
          loadFailedSnackbarMessage: "Custom load failed text",
          undoSuccessSnackbarMessage: "Custom undo success text",
        };
      });

      // Act
      const { undoButtonLabel, undoSuccessSnackbarMessage, loadFailedSnackbarMessage } = await useFormLoad(
        props,
        formRef,
        entityName,
        inProgress,
        error,
        isLoaded,
        formMessages
      );

      // Assert
      expect(undoButtonLabel.value).toEqual("Custom undo text");
      expect(undoSuccessSnackbarMessage.value).toEqual("Custom undo success text");
      expect(loadFailedSnackbarMessage.value).toEqual("Custom load failed text");
    });
  });

  describe("Computed state", () => {
    it("should set the undo button disabled when in progress", async () => {
      // Arrange
      inProgress.value = true;

      // Assert
      expect(useFormLoadInstance.isUndoDisabled.value).toEqual(true);
    });
  });
});
