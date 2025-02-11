import "reflect-metadata";
import { describe, it, expect, vi } from "vitest";
import { useDatePresets } from "@/composables/useDatePresets";

vi.mock("@/composables/useI18next");

describe("useDatePresets", () => {
  it("should correctly calculate day presets", async () => {
    const { presets } = await useDatePresets({ dayPresets: [1, 7], monthPresets: [] });
    const dayPresets = presets.value.daysExcludingToday;
    expect(dayPresets.length).toBe(2);
  });

  it("should correctly calculate month presets", async () => {
    const { presets } = await useDatePresets({ dayPresets: [], monthPresets: [0, 1] });
    const monthPresets = presets.value.months;
    expect(monthPresets.length).toBe(2);
  });
});
