import { describe, it, expect } from "vitest";
import { flattenFilter } from "../flattenFilter";
import { TableFilter } from "@/models";

describe("flattenFilter", () => {
  it("should return an empty object when the input is an empty object", () => {
    // Arrange
    const tableFilter: TableFilter = {};

    // Act
    const result = flattenFilter(tableFilter);

    // Assert
    expect(result).toEqual({});
  });

  it("should flatten a single-level filter", () => {
    // Arrange
    const tableFilter: TableFilter = {
      key1: { title: "key 1", selectedValue: { value: "value1" } },
      key2: { title: "key 2", selectedValue: { value: "value2" } },
    };

    // Act
    const result = flattenFilter(tableFilter);

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveProperty("key1");
    expect(result).toHaveProperty("key2");
  });

  it("should flatten a nested filter", () => {
    // Arrange
    const tableFilter: TableFilter = {
      key1: {
        title: "key 1",
        children: {
          key1_1: { title: "key1_1", selectedValue: { value: "value1_1" } },
          key1_2: { title: "key1_1", selectedValue: { value: "value1_2" } },
        },
      },
      key2: {
        title: "key 2",
        selectedValue: { value: "value2" },
      },
    };

    // Act
    const result = flattenFilter(tableFilter);

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveProperty("key1");
    expect(result).toHaveProperty("key1_1");
    expect(result).toHaveProperty("key1_2");
    expect(result).toHaveProperty("key2");
  });

  it("should handle deeply nested filters", () => {
    // Arrange
    const tableFilter: TableFilter = {
      key1: {
        title: "Key 1",
        children: {
          key1_1: {
            title: "Key 1 1",
            children: {
              key1_1_1: { title: "Key 1 1 1", selectedValue: { value: "value1_1_1" } },
            },
          },
        },
      },
    };

    //  Act
    const result = flattenFilter(tableFilter);

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveProperty("key1");
    expect(result).toHaveProperty("key1_1");
    expect(result).toHaveProperty("key1_1_1");
  });
});
