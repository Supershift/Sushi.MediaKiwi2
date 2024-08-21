import "reflect-metadata";
import axios from "axios";
import { describe, it, expect, vi } from "vitest";
import { ref, computed, ModelRef } from "vue";
import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { TResult } from "@/models/form/TResult";
import { useFormLoad } from "./../useFormLoad";
import { createTestingPinia } from "@pinia/testing";
import { useErrorProblemDetails } from "@/composables/useErrorProblemDetails";
import { LoadProps, UndoProps } from "@/models/form/FormProps";

// Mock the axios instance
const axiosMock = axios.create();

// Mock the useI18next composable
vi.mock("@/composables/useI18next");

describe("useFormLoad", () => {
  beforeEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });

  // Create a testing pinia store
  createTestingPinia();

  // Register the axios interceptor
  const { registerInterceptor } = useErrorProblemDetails();
  registerInterceptor(axiosMock);

  const formRef = ref(null);
  const entityName = computed<string>(() => "Market");
  const inProgress = { value: false } as ModelRef<boolean>;
  const error = { value: null } as ModelRef<ErrorProblemDetails | null | undefined>;

  // Arrange
  const props = computed<LoadProps & UndoProps>(() => ({
    onLoad: undefined,
  }));

  describe("onLoad handler", () => {
    it("should tell when no load handler is present", async () => {
      // Act
      const { hasLoadHandler } = await useFormLoad(props, formRef, entityName, inProgress, error);

      // Assert
      expect(hasLoadHandler.value).toBeFalsy();
    });

    it("should call onLoad handler and return success result", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockResolvedValueOnce(TResult.success({ id: 1, name: "Market 1" }));
      const spy = vi.spyOn(inProgress, "value", "set");

      // Act
      const { hasLoadHandler, onLoad } = await useFormLoad(props, formRef, entityName, inProgress, error);
      const result = await onLoad();

      // Assert
      expect(hasLoadHandler).toBeTruthy();
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(2);
      expect(result).toEqual(TResult.success());
    });

    it("should call onLoad handler to handle an error result", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockImplementationOnce(() => {
        throw new Error("Failed to load data");
      });

      const spy = vi.spyOn(error, "value", "set");

      // Act
      const { onLoad } = await useFormLoad(props, formRef, entityName, inProgress, error);
      await onLoad();

      // Assert
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });

    it("should call onLoad handler to handle an axios error result", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockImplementationOnce(async () => {
        return await axiosMock.get("/mocked-endpoint");
      });

      const spy = vi.spyOn(error, "value", "set");

      // Act
      const { onLoad } = await useFormLoad(props, formRef, entityName, inProgress, error);
      const result = await onLoad();

      // Assert
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(result.isSuccess).toEqual(false);
    });
  });

  describe("onUndo handler", () => {
    const formRef = ref(null);
    const entityName = computed<string>(() => "Market");
    const inProgress = { value: false } as ModelRef<boolean>;
    const error = { value: null } as ModelRef<ErrorProblemDetails | null | undefined>;

    it("should tell when no load handler is present", async () => {
      // Arrange
      props.value.onLoad = undefined;

      // Act
      const { hasUndoHanlder } = await useFormLoad(props, formRef, entityName, inProgress, error);

      // Assert
      expect(hasUndoHanlder.value).toBeFalsy();
    });

    it("should tell when load handler is present but hideUndo is set", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockResolvedValueOnce(TResult.success({ id: 1, name: "Market 1" }));
      props.value.hideUndo = true;

      // Act
      const { hasUndoHanlder } = await useFormLoad(props, formRef, entityName, inProgress, error);

      // Assert
      expect(hasUndoHanlder.value).toBeFalsy();
    });

    it("should call onLoad handler and return success result", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockResolvedValueOnce(TResult.success({ id: 1, name: "Market 1" }));

      const spy = vi.spyOn(inProgress, "value", "set");

      // Act
      const { onUndo } = await useFormLoad(props, formRef, entityName, inProgress, error);
      const result = await onUndo();

      // Assert
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(2);
      expect(result).toEqual(TResult.success());
    });

    it("should call onLoad handler to handle an error result", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockImplementationOnce(() => {
        throw new Error("Failed to load data");
      });

      const spy = vi.spyOn(error, "value", "set");

      // Act
      const { onUndo } = await useFormLoad(props, formRef, entityName, inProgress, error);
      await onUndo();

      // Assert
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });

    it("should call onLoad handler to handle an axios error result", async () => {
      // Arrange
      props.value.onLoad = vi.fn().mockImplementationOnce(async () => {
        return await axiosMock.get("/mocked-endpoint");
      });

      const spy = vi.spyOn(error, "value", "set");

      // Act
      const { onUndo } = await useFormLoad(props, formRef, entityName, inProgress, error);
      const result = await onUndo();

      // Assert
      expect(props.value.onLoad).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(result.isSuccess).toEqual(false);
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
        const { loadFailedSnackbarMessage } = await useFormLoad(props, formRef, entityName, inProgress, error);

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
        const { loadFailedSnackbarMessage } = await useFormLoad(props, formRef, entityName, inProgress, error);

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
      const { undoButtonLabel, undoSuccessSnackbarMessage } = await useFormLoad(props, formRef, entityName, inProgress, error);

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
      const { undoButtonLabel, undoSuccessSnackbarMessage, loadFailedSnackbarMessage } = await useFormLoad(props, formRef, entityName, inProgress, error);

      // Assert
      expect(undoButtonLabel.value).toEqual("Custom undo text");
      expect(undoSuccessSnackbarMessage.value).toEqual("Custom undo success text");
      expect(loadFailedSnackbarMessage.value).toEqual("Custom load failed text");
    });
  });
});
