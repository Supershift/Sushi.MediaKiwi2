import "reflect-metadata";
import { describe, it, expect } from "vitest";
import type { Sorting } from "../../models/api/Sorting";
import type { TableMap } from "../../models/table/TableMap";
import { useTableMapItemSorting } from "./../useTableMapItemSorting";
import { IconsLibrary, SortDirection } from "../../models";
import { nameof } from "../..//helpers/UtilsHelper";

interface ISampleData {
  id: number;
  name: string;
  countryCode: string;
  countryName: string;
  date: Date;
}

// create a sorting option object with a default value
const selectedSortOption: Sorting = {
  sortBy: nameof<ISampleData>((x) => x.name),
  sortDirection: SortDirection.Desc,
};

describe("useTableMapItemSorting.spec", () => {
  /** Init selection composable for item selection with the table map and data  */
  /** Init sorting composable */
  const { setSorting, getSortingClasses, selectedSorting, sortIcon } = useTableMapItemSorting({
    selectedSortOption,
  });

  describe("Determine sort order", () => {
    it("Should toggle sort direction", () => {
      setSorting({
        id: (x) => x.name,
        sortDirection: SortDirection.Asc,
      });

      expect(selectedSorting.value.sortBy === "name");
      expect(selectedSorting.value.sortDirection === SortDirection.Asc);
    });

    it("Should toggle sort by", () => {
      setSorting({
        id: (x) => x.date,
        sortDirection: SortDirection.Asc,
      });

      expect(selectedSorting.value.sortBy === "date");
      expect(selectedSorting.value.sortDirection === SortDirection.Asc);
    });

    it("Should match asc icon", () => {
      setSorting({
        id: (x) => x.date,
        sortDirection: SortDirection.Asc,
      });

      expect(sortIcon.value === IconsLibrary.mdiArrowUp);
    });

    it("Should match desc icon", () => {
      setSorting({
        id: (x) => x.date,
        sortDirection: SortDirection.Desc,
      });

      expect(sortIcon.value === IconsLibrary.mdiArrowDown);
    });

    it("Should have active class", () => {
      setSorting({
        id: (x) => x.date,
        sortDirection: SortDirection.Asc,
      });

      const classes = getSortingClasses({
        id: (x) => x.date,
        sortDirection: SortDirection.Asc,
      });

      expect(classes.active);
    });
  });
});
