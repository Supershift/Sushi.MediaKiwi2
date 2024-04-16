import { describe, it, expect } from "vitest";
import { useTableRowSelection } from "../useTableRowSelection";
import { computed } from "vue";

type SampleData = {
  id: number;
  name: string;
  countryCode: string;
  countryName: string;
  date: Date;
};

const testData = <SampleData[]>[
  { id: 1, name: "Data A" },
  { id: 2, name: "Data B" },
  { id: 3, name: "Data C" },
];

describe("useTableRowSelection", () => {
  /** Init selection composable for item selection with the table map and data  */
  const { selectAll, selectItem, isItemSelected, isAllSelected, isIndeterminate, selectedItems } = useTableRowSelection({
    itemId: (item) => item.id,
    data: computed(() => testData),
  });

  describe("Select items", () => {
    it("Should select some", () => {
      const dataItem = testData[0];

      expect(selectedItems.value.length).toBe(0);
      expect(isItemSelected(dataItem)).toBe(false);
      expect(isIndeterminate.value).toBe(false);

      // Select the first row
      selectItem(dataItem, true);

      expect(selectedItems.value.length).toBe(1);
      expect(isItemSelected(dataItem)).toBe(true);
      expect(isIndeterminate.value).toBe(true);
    });

    it("Should select all", () => {
      expect(selectedItems.value.length).toBeLessThan(testData.length);
      expect(isAllSelected.value).toBe(false);

      // Select all rows
      selectAll(true);

      expect(selectedItems.value.length).toBe(testData.length);
      expect(isAllSelected.value).toBe(true);
    });
  });

  describe("Deselect items", () => {
    it("Should deselect Some", () => {
      const dataItem = testData[2];

      expect(selectedItems.value.length).toBe(testData.length);
      expect(isItemSelected(dataItem)).toBe(true);
      expect(isAllSelected.value).toBe(true);

      // Deselect the third row
      selectItem(dataItem, false);

      expect(selectedItems.value.length).toBe(2);
      expect(isItemSelected(dataItem)).toBe(false);
      expect(isAllSelected.value).toBe(false);
    });

    it("Should deselect all", () => {
      expect(selectedItems.value.length).toBeGreaterThan(0);
      expect(isIndeterminate.value).toBe(true);

      // Deselect all row
      selectAll(false);

      expect(selectedItems.value.length).toBe(0);
      expect(isIndeterminate.value).toBe(false);
    });
  });
});
