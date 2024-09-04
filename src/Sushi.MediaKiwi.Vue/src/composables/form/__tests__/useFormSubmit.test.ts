import "reflect-metadata";
import axios from "axios";
import { vi, describe, it, expect, afterEach } from "vitest";
import { ref, computed, ModelRef } from "vue";
import { useFormSubmit } from "../useFormSubmit";
import { createTestingPinia } from "@pinia/testing";
import { ErrorProblemDetails, TResult, useFormMessages, useI18next, useSnackbarStore } from "@/framework";
import { SubmitProps } from "@/models/form/FormProps";
import { addErrorHandler } from "@/services/axios/interceptor";

// Mock the axios instance
const axiosMock = axios.create();

// Mock the useI18next composable
vi.mock("@/composables/useI18next");

describe("useFormSubmit", async () => {
  // Create a testing pinia store
  createTestingPinia();

  // Register the axios interceptor
  addErrorHandler(axiosMock);

  const formMessages = await useFormMessages();

  // Inject the snackbar store
  const snackbar = useSnackbarStore();

  // Mock the form reference
  const formRef = ref<any>({ reset: vi.fn(), validate: vi.fn() });
  const entityName = ref<string>("Market");
  const entityLabel = computed<string>(() => entityName.value);
  const inProgress = ref<boolean>(false) as ModelRef<boolean>;
  const error = ref<ErrorProblemDetails | null | undefined>() as ModelRef<ErrorProblemDetails | null | undefined>;
  const isValid = ref<boolean>(false) as ModelRef<boolean>;

  // Arrange
  const props = computed<SubmitProps>(() => ({
    onSubmit: vi.fn().mockResolvedValueOnce(Promise.resolve()),
  }));
  const progressSpy = vi.spyOn(inProgress, "value", "set");
  const errorSpy = vi.spyOn(error, "value", "set");
  const formResetSpy = vi.spyOn(formRef.value, "reset");
  const showMessageSpy = vi.spyOn(snackbar, "showMessage");

  // Act
  const useFormSubmitInstance = await useFormSubmit(props, formRef, entityLabel, inProgress, error, isValid, formMessages);

  // Spy on the composable functions
  const confirmSpy = vi.spyOn(useFormSubmitInstance.submitConfirmDialog, "value", "set");

  beforeEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });

  afterEach(() => {
    // reset props
    props.value.editLabels = false;
    props.value.saveLabels = false;
    props.value.confirmBeforeSubmit = false;
    props.value.resetOnSubmit = false;

    props.value.submitButtonLabel = undefined;
    props.value.submitConfirmationTitle = undefined;
    props.value.submitSuccessfulSnackbarMessage = undefined;
    props.value.submitConfirmationBody = undefined;

    entityName.value = "";
  });

  describe("onSubmit handler", () => {
    it("should submit the form and return a success result", async () => {
      // Arrage
      isValid.value = true;

      // Act
      await useFormSubmitInstance.onSubmit(undefined, true);

      // Assert the function calls
      expect(useFormSubmitInstance.hasSubmitHandler).toBeTruthy();
      expect(props.value.onSubmit).toHaveBeenCalled();
      expect(progressSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalledWith(null);
    });

    it("should not submit the form if it is invalid", async () => {
      // Arrange
      isValid.value = false;

      // Act
      await useFormSubmitInstance.onSubmit(undefined, true);

      // Assert the function calls
      expect(props.value.onSubmit).not.toHaveBeenCalled();
    });

    it("should aks confirmation before submitting if configured", async () => {
      // Arrange
      isValid.value = true;
      props.value.confirmBeforeSubmit = true;

      // Act
      await useFormSubmitInstance.onSubmit();

      // Assert the function calls
      expect(confirmSpy).toHaveBeenCalledWith(true);
      expect(props.value.onSubmit).not.toHaveBeenCalled();
      expect(progressSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it("should submit the form after confirmation", async () => {
      // Arrange
      isValid.value = true;

      // Act
      await useFormSubmitInstance.onSubmit(undefined, true);

      // Assert the function calls
      expect(props.value.onSubmit).toHaveBeenCalled();
      expect(progressSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalledWith(null);
    });

    it("should reset the form after successful submission if configured", async () => {
      // Arrange
      isValid.value = true;
      props.value.resetOnSubmit = true;

      // Act
      await useFormSubmitInstance.onSubmit(undefined, true);

      // Assert the function calls
      expect(formResetSpy).toHaveBeenCalled();
      expect(props.value.onSubmit).toHaveBeenCalled();
      expect(progressSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalledWith(null);
    });

    it("should show a success message after successful submission if not hidden", async () => {
      // Arrange
      isValid.value = true;

      // Act
      await useFormSubmitInstance.onSubmit(undefined, true);

      // Assert the function calls
      expect(showMessageSpy).toHaveBeenCalledWith("Successfully submitted the entry");
      expect(props.value.onSubmit).toHaveBeenCalled();
      expect(progressSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalledWith(null);
    });

    it("should handle and show an error message after failed submission", async () => {
      // Arrange
      isValid.value = true;

      // Mock the onSubmit function to throw an error
      props.value.onSubmit = vi.fn().mockImplementationOnce(async () => {
        return await axiosMock.get("/mocked-endpoint");
      });

      // Act
      await useFormSubmitInstance.onSubmit(undefined, true);

      // Assert the function calls
      expect(showMessageSpy).not.toHaveBeenCalled();
      expect(props.value.onSubmit).toHaveBeenCalled();
      expect(progressSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalled();
      expect(error.value).not.toBeNull();
    });

    it("should handle and show an error message after successful submission", async () => {
      // Arrange
      isValid.value = true;

      // Mock the onSubmit function to throw an error
      props.value.onSubmit = vi.fn().mockImplementationOnce(async () => {
        return TResult.failure(new ErrorProblemDetails("Submit succeeded, but there was an expected sub error"));
      });

      // Act
      await useFormSubmitInstance.onSubmit(undefined, true);

      // Assert the function calls
      expect(showMessageSpy).not.toHaveBeenCalled();
      expect(props.value.onSubmit).toHaveBeenCalled();
      expect(progressSpy).toHaveBeenCalledTimes(2);
      expect(errorSpy).toHaveBeenCalled();
      expect(error.value).not.toBeNull();
      expect(error.value?.detail).toBe("Submit succeeded, but there was an expected sub error");
    });
  });

  describe("Computed labels", () => {
    describe("Sumbit labels", () => {
      it("should return default submit labels", async () => {
        // Assert
        expect(useFormSubmitInstance.submitButtonLabel.value).toEqual("Submit");
        expect(useFormSubmitInstance.submitConfirmationTitle.value).toEqual("Submit this entry");
        expect(useFormSubmitInstance.submitSuccessMessage.value).toEqual("Successfully submitted the entry");
        expect(useFormSubmitInstance.submitConfirmationBody.value).toEqual("Are you sure you want to submit this entry?");
      });

      it("should return the submit labels set on the props", async () => {
        // Arrage
        const customProps = computed<SubmitProps>(() => ({
          submitButtonLabel: "Post",
          submitConfirmationTitle: "Post this item",
          submitSuccessfulSnackbarMessage: "Successfully posted the item",
          submitConfirmationBody: "Are you sure you want to submit this item",
        }));

        // Act
        const { submitButtonLabel, submitConfirmationTitle, submitSuccessMessage, submitConfirmationBody } = await useFormSubmit(
          customProps,
          formRef,
          entityLabel,
          inProgress,
          error,
          isValid,
          formMessages
        );

        // Assert
        expect(submitButtonLabel.value).toEqual("Post");
        expect(submitConfirmationTitle.value).toEqual("Post this item");
        expect(submitSuccessMessage.value).toEqual("Successfully posted the item");
        expect(submitConfirmationBody.value).toEqual("Are you sure you want to submit this item");
      });

      it("should return the submit labels with custom entry name", async () => {
        // Arrage
        entityName.value = "Market";

        // Assert
        expect(useFormSubmitInstance.submitButtonLabel.value).toEqual("Submit");
        expect(useFormSubmitInstance.submitConfirmationTitle.value).toEqual("Submit this Market");
        expect(useFormSubmitInstance.submitSuccessMessage.value).toEqual("Successfully submitted the Market");
        expect(useFormSubmitInstance.submitConfirmationBody.value).toEqual("Are you sure you want to submit this Market?");
      });
    });

    describe("Save labels", () => {
      it("should return default save labels", async () => {
        // Arrage
        const customProps = computed<SubmitProps>(() => ({
          saveLabels: true,
        }));

        // Act
        const { submitButtonLabel, submitConfirmationTitle, submitSuccessMessage, submitConfirmationBody } = await useFormSubmit(
          customProps,
          formRef,
          entityLabel,
          inProgress,
          error,
          isValid,
          formMessages
        );

        // Assert
        expect(submitButtonLabel.value).toEqual("Save");
        expect(submitConfirmationTitle.value).toEqual("Save this entry");
        expect(submitSuccessMessage.value).toEqual("Successfully saved the entry");
        expect(submitConfirmationBody.value).toEqual("Are you sure you want to save this entry?");
      });

      it("should return the save labels with custom entry name", async () => {
        // Arrage
        entityName.value = "Market";
        const customProps = computed<SubmitProps>(() => ({
          saveLabels: true,
        }));

        // Act
        const { submitButtonLabel, submitConfirmationTitle, submitSuccessMessage, submitConfirmationBody } = await useFormSubmit(
          customProps,
          formRef,
          entityLabel,
          inProgress,
          error,
          isValid,
          formMessages
        );

        // Assert
        expect(submitButtonLabel.value).toEqual("Save");
        expect(submitConfirmationTitle.value).toEqual("Save this Market");
        expect(submitSuccessMessage.value).toEqual("Successfully saved the Market");
        expect(submitConfirmationBody.value).toEqual("Are you sure you want to save this Market?");
      });
    });

    describe("Edit labels", () => {
      it("should return default edit labels", async () => {
        // Arrage
        const customProps = computed<SubmitProps>(() => ({
          editLabels: true,
        }));

        // Act
        const { submitButtonLabel, submitConfirmationTitle, submitSuccessMessage, submitConfirmationBody } = await useFormSubmit(
          customProps,
          formRef,
          entityLabel,
          inProgress,
          error,
          isValid,
          formMessages
        );

        expect(submitButtonLabel.value).toEqual("Save");
        expect(submitConfirmationTitle.value).toEqual("Edit this entry");
        expect(submitSuccessMessage.value).toEqual("Successfully edited the entry");
        expect(submitConfirmationBody.value).toEqual("Are you sure you want to edit this entry?");
      });

      it("should return the edit labels with custom entry name", async () => {
        // Arrage
        entityName.value = "Market";
        const customProps = computed<SubmitProps>(() => ({
          editLabels: true,
        }));

        // Act
        const { submitButtonLabel, submitConfirmationTitle, submitSuccessMessage, submitConfirmationBody } = await useFormSubmit(
          customProps,
          formRef,
          entityLabel,
          inProgress,
          error,
          isValid,
          formMessages
        );

        // Assert

        // Assert
        expect(submitButtonLabel.value).toEqual("Save");
        expect(submitConfirmationTitle.value).toEqual("Edit this Market");
        expect(submitSuccessMessage.value).toEqual("Successfully edited the Market");
        expect(submitConfirmationBody.value).toEqual("Are you sure you want to edit this Market?");
      });
    });
  });

  describe("Computed state", () => {
    // submit button State

    it("should return the submit button color as neutral when in progress", async () => {
      // Arrange
      inProgress.value = true;

      // Assert
      expect(useFormSubmitInstance.submitButtonColor.value).toEqual("neutral");
      expect(useFormSubmitInstance.isSubmitDisabled.value).toEqual(true);
    });

    it("should return that there is no submit hanlder present ", async () => {
      // Arrage
      const customProps = computed<SubmitProps>(() => ({}));

      // Act
      const { hasSubmitHandler } = await useFormSubmit(customProps, formRef, entityLabel, inProgress, error, isValid, formMessages);

      // Assert
      expect(hasSubmitHandler.value).toBeFalsy();
    });
  });
});
