import "reflect-metadata";
import { describe, it, expect, vi } from "vitest";
import { useFormDelete } from "../useFormDelete";
import { computed, ModelRef, ref } from "vue";
import { ProblemDetails } from "@/models/errors/ProblemDetails";
import { useI18next } from "@/composables/useI18next";
import { createTestingPinia } from "@pinia/testing";
import { DeleteProps } from "@/models/form";
import { AxiosResponse, HttpStatusCode } from "axios";

const hoists = vi.hoisted(() => {
  return {
    onDelete: vi.fn(),
    navigateToParent: vi.fn(),
    redirectAfterDelete: false,
  };
});

// Mock the useI18next composable
vi.mock("@/composables/useI18next", async () => {
  const mod = await import("@/composables/useI18next");
  return {
    ...mod,
    // Mock the useI18next
    useI18next: async () => ({
      i18next: {
        value: {
          resolvedLanguage: "en",
        },
      },
      t: {
        value: vi.fn().mockImplementation((_key: string, value: string) => {
          return value;
        }),
      },
      defaultT: {
        value: vi.fn().mockImplementation((_key: string, value: string) => {
          return value;
        }),
      },
      formatNumber: {
        value: vi.fn().mockImplementation((value: number) => {
          return value.toFixed(2);
        }),
      },
    }),
  };
});

describe("useFormDelete", async () => {
  beforeEach(() => {
    // reset all defined mock functions
    vi.clearAllMocks();
  });

  // Create a testing pinia store
  createTestingPinia();

  // Mock the models
  const inProgress = { value: false } as ModelRef<boolean>;
  const error = { value: null } as ModelRef<ProblemDetails | null | undefined>;

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

    const useFormDeleteInstance = await useFormDelete(useI18next(), props, inProgress, error);

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

      const propblemDetails = <ProblemDetails>{
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

    const useFormDeleteInstance = await useFormDelete(useI18next(), props, inProgress, error);

    it("should throw error", async () => {
      // Act
      const result = await useFormDeleteInstance.onDelete();

      // Assert
      expect(props.value.onDelete).toBeUndefined();
      expect(useFormDeleteInstance.hasDeleteHandler.value).toBeFalsy();
      expect(result.isSuccess).toBeFalsy();
    });
  });
});
