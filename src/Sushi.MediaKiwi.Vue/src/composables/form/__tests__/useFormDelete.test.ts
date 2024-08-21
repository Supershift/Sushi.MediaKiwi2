import "reflect-metadata";
import { describe, it, expect, vi } from "vitest";
import { useFormDelete } from "../useFormDelete";
import { computed, ModelRef, ref } from "vue";
import { ErrorProblemDetails } from "@/models/errors/ErrorProblemDetails";
import { createTestingPinia } from "@pinia/testing";
import { DeleteProps } from "@/models/form/FormProps";
import { AxiosResponse, HttpStatusCode } from "axios";

const hoists = vi.hoisted(() => {
  return {
    onDelete: vi.fn(),
    navigateToParent: vi.fn(),
    redirectAfterDelete: false,
  };
});

// Mock the useI18next composable
vi.mock("@/composables/useI18next");

describe("useFormDelete", async () => {
  beforeEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });

  // Create a testing pinia store
  createTestingPinia();

  // Mock the models
  const inProgress = { value: false } as ModelRef<boolean>;
  const error = { value: null } as ModelRef<ErrorProblemDetails | null | undefined>;
  const formRef = ref();
  const entityName = computed(() => "entry");

  describe("Form has DeleteHandler", async () => {
    const props = computed<DeleteProps>(() => ({
      onDelete: hoists.onDelete,
      deleteButtonLabel: "Custom Delete",
      deleteConfirmationTitle: "Confirmation Title",
      deleteConfirmationBody: "Confirmation Body",
      deleteSuccessfullSnackbarMessage: "Delete Successful",
      deleteFailedSnackbarMessage: "Delete Failed",
      hideDeleteSnackbar: false,
      redirectAfterDelete: hoists.redirectAfterDelete,
    }));

    const useFormDeleteInstance = await useFormDelete(props, formRef, entityName, inProgress, error);

    it("should have delete handler", async () => {
      // Assert
      expect(useFormDeleteInstance.hasDeleteHandler.value).toBeTruthy();
    });

    it("should update inProgress model", async () => {
      // Arrange
      const spy = vi.spyOn(inProgress, "value", "set");

      // Act
      await useFormDeleteInstance.onDelete();

      // Assert
      expect(props.value.onDelete).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(true);
      expect(spy).toHaveBeenCalledWith(false);
    });

    it("should update error model", async () => {
      // Arrange
      const spy = vi.spyOn(error, "value", "set");

      const propblemDetails = <ErrorProblemDetails>{
        title: "Internal Server Error",
        status: 500,
        detail: "An error occurred while deleting the data",
        type: "https://httpstatuses.com/500",
      };

      hoists.onDelete.mockRejectedValue(<AxiosResponse>{
        data: {
          ...propblemDetails,
        },
      });

      // Act
      await useFormDeleteInstance.onDelete();
      // Assert
      expect(props.value.onDelete).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledOnce();
    });

    it("should have correct labels", async () => {
      // Assert
      expect(useFormDeleteInstance.deleteButtonLabel.value).toBe("Custom Delete");
      expect(useFormDeleteInstance.deleteConfirmationTitle.value).toBe("Confirmation Title");
      expect(useFormDeleteInstance.deleteConfirmationBody.value).toBe("Confirmation Body");
      expect(useFormDeleteInstance.deleteSuccessfulMessage.value).toBe("Delete Successful");
      expect(useFormDeleteInstance.deleteFailedMessage.value).toBe("Delete Failed");
    });

    it("should have success result", async () => {
      // Arrange
      hoists.onDelete.mockResolvedValue(<AxiosResponse>{
        status: HttpStatusCode.Ok,
      });

      hoists.redirectAfterDelete = false;

      // Act
      const result = await useFormDeleteInstance.onDelete();

      // Assert
      expect(result).toBeDefined();
      expect(result.isSuccess).toBeTruthy();
    });
  });

  describe("Form without DeleteHandler", async () => {
    const props = computed<DeleteProps>(() => ({}));

    const useFormDeleteInstance = await useFormDelete(props, formRef, entityName, inProgress, error);

    it("should throw error", async () => {
      // Act
      const result = await useFormDeleteInstance.onDelete();

      // Assert
      expect(props.value.onDelete).toBeUndefined();
      expect(useFormDeleteInstance.hasDeleteHandler.value).toBeFalsy();
      expect(result.isSuccess).toBeFalsy();
    });
  });

  describe("Computed labels", () => {
    it("should return default delete labels", async () => {
      const customProps = computed<DeleteProps>(() => ({}));

      const { deleteButtonLabel, deleteConfirmationTitle, deleteConfirmationBody, deleteSuccessfulMessage, deleteFailedMessage } = await useFormDelete(
        customProps,
        formRef,
        entityName,
        inProgress,
        error
      );

      // Assert
      expect(deleteButtonLabel.value).toEqual("Delete");
      expect(deleteConfirmationTitle.value).toEqual("Delete this entry");
      expect(deleteConfirmationBody.value).toEqual("Are you sure you want to delete this entry?");
      expect(deleteSuccessfulMessage.value).toEqual("Successfully deleted the entry");
      expect(deleteFailedMessage.value).toEqual("Failed to delete the entry");
    });

    it("should return the submit labels set on the props", async () => {
      // Arrage
      const customProps = computed<DeleteProps>(() => ({
        deleteButtonLabel: "Remove",
        deleteConfirmationTitle: "Remove this item",
        deleteConfirmationBody: "Are you sure you want to remove this item",
        deleteSuccessfullSnackbarMessage: "Successfully removed the item",
        deleteFailedSnackbarMessage: "Failed to remove the item",
      }));

      // Act
      const { deleteButtonLabel, deleteConfirmationTitle, deleteConfirmationBody, deleteSuccessfulMessage, deleteFailedMessage } = await useFormDelete(
        customProps,
        formRef,
        entityName,
        inProgress,
        error
      );

      // Assert
      expect(deleteButtonLabel.value).toEqual("Remove");
      expect(deleteConfirmationTitle.value).toEqual("Remove this item");
      expect(deleteConfirmationBody.value).toEqual("Are you sure you want to remove this item");
      expect(deleteSuccessfulMessage.value).toEqual("Successfully removed the item");
      expect(deleteFailedMessage.value).toEqual("Failed to remove the item");
    });

    it("should return the submit labels with custom entry name", async () => {
      // Arrage
      const entityName = computed(() => "Market");
      const customProps = computed<DeleteProps>(() => ({}));

      const { deleteButtonLabel, deleteConfirmationTitle, deleteConfirmationBody, deleteSuccessfulMessage, deleteFailedMessage } = await useFormDelete(
        customProps,
        formRef,
        entityName,
        inProgress,
        error
      );

      // Assert
      expect(deleteButtonLabel.value).toEqual("Delete");
      expect(deleteConfirmationTitle.value).toEqual("Delete this Market");
      expect(deleteConfirmationBody.value).toEqual("Are you sure you want to delete this Market?");
      expect(deleteSuccessfulMessage.value).toEqual("Successfully deleted the Market");
      expect(deleteFailedMessage.value).toEqual("Failed to delete the Market");
    });
  });
});
