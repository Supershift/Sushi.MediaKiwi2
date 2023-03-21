import "reflect-metadata";
import { describe, it, expect } from "vitest";
import { TableSortingDirection } from "./../../models/table/TableSortingDirection";
import type { ITableSortingValue } from "./../../models/table/ITableSortingValue";
import type { ITableMap } from "./../../models/table/ITableMap";
import TableSortingHelper from "./../../helpers/TableSortingHelper";

const tableSortingHelper = new TableSortingHelper();
describe("TableSortingHelper", () => {
  // create a sorting option object with a default value
  const selectedSortOption: ITableSortingValue = {
    tableMapItemId: "lastSeen",
    sortDirection: TableSortingDirection.Desc,
  };

  interface ITestData {
    id: number;
    date: Date;
    countryName: string;
  }

  const tableTest = <ITableMap<ITestData>>{
    itemId: (item) => {
      return item.id;
    },
    items: [
      { id: "country", headerTitle: "Land", value: (dataItem): any => dataItem.countryName, sortingOptions: { defaultSortDirection: TableSortingDirection.Asc } },
      { id: "lastSeen", headerTitle: "Laast gezien", value: (dataItem): Date => dataItem.date, sortingOptions: { defaultSortDirection: TableSortingDirection.Desc } },
    ],
  };

  describe("Determine sort order", () => {
    it("Should toggle sort order", () => {
      const tableMapItem = tableTest.items[0];
      const newDirection = <ITableSortingValue>tableSortingHelper.parseTableSortingValue(tableMapItem, selectedSortOption);

      expect(newDirection.tableMapItemId === selectedSortOption.tableMapItemId);
      expect(newDirection.sortDirection !== selectedSortOption.sortDirection);
    });

    it("Should change tableMapItem", () => {
      const tableMapItem = tableTest.items[0];
      const newDirection = <ITableSortingValue>tableSortingHelper.parseTableSortingValue(tableMapItem, selectedSortOption);

      expect(newDirection.tableMapItemId !== selectedSortOption.tableMapItemId);
      expect(newDirection.sortDirection === selectedSortOption.sortDirection);
    });

    it("Should have active class", () => {
      const tableMapItem = tableTest.items[0];
      const newDirection = <ITableSortingValue>tableSortingHelper.parseTableSortingValue(tableMapItem, selectedSortOption);

      tableSortingHelper.getSortingClasses();

      expect(newDirection.tableMapItemId !== selectedSortOption.tableMapItemId);
      expect(newDirection.sortDirection === selectedSortOption.sortDirection);
    });
  });
});
