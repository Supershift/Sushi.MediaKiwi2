import { describe, it, expect } from "vitest";
import { useDayjs } from "@/composables/useDayjs";
import dayjs from "dayjs";

describe("useDayjs", () => {
  const useDayjsInstance = useDayjs();

  it("compares full month correctly", () => {
    // Arrange
    const start = dayjs(new Date(2024, 11, 1));
    const end = dayjs(new Date(2024, 11, 31));

    // Act
    const result = useDayjsInstance.isFullMonth.value(start, end);

    // Assert
    expect(result).toBe(true);
  });

  it("compares today correctly", () => {
    // Arrange
    const now = dayjs();

    // Act
    const result = useDayjsInstance.isToday.value(now);

    // Assert
    expect(result).toBe(true);
  });
});
