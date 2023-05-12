import "reflect-metadata";
import { describe, it, expect } from "vitest";
import { SortDirection } from "./../../models";
import type { Sorting } from "./../../models/api/Sorting";
import type { TableMap } from "./../../models/table/TableMap";
import TableSortingHelper from "./../../helpers/TableSortingHelper";

const tableSortingHelper = new TableSortingHelper();
describe("TableSortingHelper", () => {
  // create a sorting option object with a default value
  const selectedSortOption: Sorting = {
    sortBy: "lastSeen",
    sortDirection: SortDirection.Desc,
  };

  interface ITestData {
    id: number;
    date: Date;
    countryName: string;
  }

  const tableTest = <TableMap<ITestData>>{
    itemId: (item) => {
      return item.id;
    },
    items: [
      {
        headerTitle: "Land",
        value: (dataItem): any => dataItem.countryName,
        sortingOptions: {
          id: (x) => {
            x.countryName;
          },
          sortDirection: SortDirection.Asc,
        },
      },
      {
        headerTitle: "Laast gezien",
        value: (dataItem): Date => dataItem.date,
        sortingOptions: {
          id: (x) => {
            x.date;
          },
          sortDirection: SortDirection.Desc,
        },
      },
    ],
  };

  describe("Determine sort order", () => {
    it("Should toggle sort order", () => {
      const tableMapItem = tableTest.items[0];
      const newDirection = <Sorting>tableSortingHelper.parseSorting(tableMapItem, selectedSortOption);

      expect(newDirection.sortBy === selectedSortOption.sortBy);
      expect(newDirection.sortDirection !== selectedSortOption.sortDirection);
    });

    it("Should change tableMapItem", () => {
      const tableMapItem = tableTest.items[0];
      const newDirection = <Sorting>tableSortingHelper.parseSorting(tableMapItem, selectedSortOption);

      expect(newDirection.sortBy !== selectedSortOption.sortBy);
      expect(newDirection.sortDirection === selectedSortOption.sortDirection);
    });

    it("Should have active class", () => {
      const tableMapItem = tableTest.items[0];
      const newDirection = <Sorting>tableSortingHelper.parseSorting(tableMapItem, selectedSortOption);

      const classes = tableSortingHelper.getSortingClasses(tableMapItem.sortingOptions, newDirection);

      expect(newDirection.sortBy !== selectedSortOption.sortBy);
      expect(newDirection.sortDirection === selectedSortOption.sortDirection);
      expect(classes.sortable);
    });
  });
});
