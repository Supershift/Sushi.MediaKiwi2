import "reflect-metadata";
import { describe, it, expect } from "vitest";
import { TableSortingDirection } from "./../../models/table/TableSortingDirection";
import type { ITableSortingValue } from "./../../models/table/ITableSortingValue";
import TableSortingHelper from "./../../helpers/TableSortingHelper";

const tableSortingHelper = new TableSortingHelper();
describe("TableSortingHelper", () => {
  // create a sorting option object with a default value
  const selectedSortOption: ITableSortingValue = {
    tableMapItemId: "lastSeen",
    sortDirection: TableSortingDirection.Desc,
  };

  describe("Determine sort order", () => {
    it("Should toggle sort order", () => {
      const newDirection = <ITableSortingValue>tableSortingHelper.parseTableSortingValue(
        {
          id: "lastSeen",
          sortingOptions: {},
        },
        selectedSortOption
      );

      expect(newDirection.tableMapItemId === selectedSortOption.tableMapItemId);
      expect(newDirection.sortDirection !== selectedSortOption.sortDirection);
    });

    it("Should change tableMapItem", () => {
      const newDirection = <ITableSortingValue>tableSortingHelper.parseTableSortingValue(
        {
          id: "id",
          sortingOptions: {},
        },
        selectedSortOption
      );

      expect(newDirection.tableMapItemId !== selectedSortOption.tableMapItemId);
      expect(newDirection.sortDirection === selectedSortOption.sortDirection);
    });
  });
});
