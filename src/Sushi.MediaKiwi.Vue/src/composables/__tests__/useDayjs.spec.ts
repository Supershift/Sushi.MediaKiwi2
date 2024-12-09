import { describe, it, expect } from "vitest";
import { useDayjs } from "@/composables/useDayjs";
import dayjs from "dayjs";

describe("useDayjs", () => {
  const useDayjsInstance = useDayjs();

  it("compares full month correctly", () => {
    // Arrange
    const start = new Date("2024-12-01T00:00:00.000Z");
    const end = new Date("2024-12-31T23:59:59.999Z");

    // Act
    const result = useDayjsInstance.isFullMonth.value(start, end);

    // Assert
    expect(result).toBe(true);
  });

  it("compares today correctly", () => {
    // Arrange
    const now = new Date();

    // Act
    const result = useDayjsInstance.isToday.value(now);

    // Assert
    expect(result).toBe(true);
  });
});
