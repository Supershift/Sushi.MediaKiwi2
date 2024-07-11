import "reflect-metadata";
import { describe, it, expect, vi } from "vitest";
import { useDatePresets } from "@/composables/useDatePresets";

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
        value: vi.fn().mockImplementation((_key: string, fallback: string) => {
          return fallback;
        }),
      },
      defaultT: {
        value: vi.fn().mockImplementation((_key: string, fallback: string) => {
          return fallback;
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

// Mock useDayjs and its methods
vi.mock("./useDayjs", () => ({
  useDayjs: () => ({
    currentDate: { value: new Date(2023, 3, 15) }, // Mock current date as April 15, 2023
    substractDate: {
      value: (date: string, amount: number, unit: string) => {
        const newDate = new Date(date);
        if (unit === "day") {
          newDate.setDate(newDate.getDate() - amount);
        } else if (unit === "month") {
          newDate.setMonth(newDate.getMonth() - amount);
        }
        return newDate;
      },
    },
    startOf: {
      value: (date: string, unit: string) => {
        const newDate = new Date(date);
        if (unit === "day") {
          newDate.setHours(0, 0, 0, 0);
        } else if (unit === "month") {
          newDate.setDate(1);
          newDate.setHours(0, 0, 0, 0);
        }
        return newDate;
      },
    },
    endOf: {
      value: (date: string, unit: string) => {
        const newDate = new Date(date);
        if (unit === "day") {
          newDate.setHours(23, 59, 59, 999);
        } else if (unit === "month") {
          newDate.setMonth(newDate.getMonth() + 1);
          newDate.setDate(0);
          newDate.setHours(23, 59, 59, 999);
        }
        return newDate;
      },
    },
  }),
}));

describe("useDatePresets", () => {
  it("should correctly calculate day presets", async () => {
    const { presets } = await useDatePresets({ dayPresets: [1, 7], monthPresets: [] });
    const dayPresets = presets.value.days;
    expect(dayPresets.length).toBe(2);
  });

  it("should correctly calculate month presets", async () => {
    const { presets } = await useDatePresets({ dayPresets: [], monthPresets: [0, 1] });
    const monthPresets = presets.value.months;
    expect(monthPresets.length).toBe(2);
  });

  it("presets should have correct structure", async () => {
    const { presets } = await useDatePresets({ dayPresets: [1], monthPresets: [0] });
    expect(presets.value).toHaveProperty("days");
    expect(presets.value).toHaveProperty("months");
  });
});
