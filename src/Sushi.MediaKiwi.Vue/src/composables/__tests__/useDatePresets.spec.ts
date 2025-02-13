import "reflect-metadata";
import { describe, it, expect, vi } from "vitest";
import { useDatePresets } from "@/composables/useDatePresets";
import { DateTime } from "luxon";

vi.mock("@/composables/useI18next");

describe("useDatePresets", () => {
  it("should correctly calculate day presets", async () => {
    // arrange

    // act
    const { presets } = await useDatePresets({ dayPresets: [1, 7], monthPresets: [] });
    const dayPresets = presets.value.daysExcludingToday;

    // assert
    expect(dayPresets.length).toBe(2);

    expect(dayPresets[0].start.toISODate()).toBe(DateTime.local().minus({ days: 1 }).toISODate());
    expect(dayPresets[0].end.toISODate()).toBe(DateTime.local().minus({ days: 1 }).toISODate());
    expect(dayPresets[0].duration!.toISO()).toBe("P1D");

    expect(dayPresets[1].start.toISODate()).toBe(DateTime.local().minus({ days: 7 }).toISODate());
    expect(dayPresets[1].end.toISODate()).toBe(DateTime.local().minus({ days: 1 }).toISODate());
    expect(dayPresets[1].duration!.toISO()).toBe("P7D");
  });

  it("should correctly calculate month presets", async () => {
    // arrange

    // act
    const { presets } = await useDatePresets({ dayPresets: [], monthPresets: [0, 1] });
    const monthPresets = presets.value.months;

    // assert
    expect(monthPresets.length).toBe(2);

    expect(monthPresets[0].start.toISODate()).toBe(DateTime.local().startOf("month").toISODate());
    expect(monthPresets[0].end.toISODate()).toBe(DateTime.local().endOf("month").toISODate());
    expect(monthPresets[0].duration!.toISO()).toBe("P1M");

    expect(monthPresets[1].start.toISODate()).toBe(DateTime.local().minus({ month: 1 }).startOf("month").toISODate());
    expect(monthPresets[1].end.toISODate()).toBe(DateTime.local().minus({ month: 1 }).endOf("month").toISODate());
    expect(monthPresets[1].duration!.toISO()).toBe("P1M");
  });
});
