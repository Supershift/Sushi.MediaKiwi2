import "reflect-metadata";
import { describe, it, expect } from "vitest";
import type { Sorting } from "../../models/api/Sorting";
import { useTableSorting } from "../useTableSorting";
import { IconsLibrary, SortDirection } from "../../models";
import { nameof } from "../../helpers/UtilsHelper";

type SampleData = {
  id: number;
  name: string;
  countryCode: string;
  countryName: string;
  date: Date;
};

// create a sorting option object with a default value
const selectedSortOption: Sorting = {
  sortBy: nameof<SampleData>((x) => x.name),
  sortDirection: SortDirection.Desc,
};

describe("useTableSorting.spec", () => {
  /** Init selection composable for item selection with the table map and data  */
  /** Init sorting composable */
  const { setSorting, getSortingClasses, selectedSorting, sortIcon } = useTableSorting({
    selectedSortOption,
  });

  describe("Determine sort order", () => {
    it("Should toggle sort direction", () => {
      setSorting({
        id: (x: any) => x.name,
        sortDirection: SortDirection.Asc,
      });

      expect(selectedSorting.value!.sortBy === "name");
      expect(selectedSorting.value!.sortDirection === SortDirection.Asc);
    });

    it("Should toggle sort by", () => {
      setSorting({
        id: (x: any) => x.date,
        sortDirection: SortDirection.Asc,
      });

      expect(selectedSorting.value!.sortBy === "date");
      expect(selectedSorting.value!.sortDirection === SortDirection.Asc);
    });

    it("Should match asc icon", () => {
      setSorting({
        id: (x: any) => x.date,
        sortDirection: SortDirection.Asc,
      });

      expect(sortIcon.value === IconsLibrary.arrowUp);
    });

    it("Should match desc icon", () => {
      setSorting({
        id: (x: any) => x.date,
        sortDirection: SortDirection.Desc,
      });

      expect(sortIcon.value === IconsLibrary.arrowDown);
    });

    it("Should have active class", () => {
      setSorting({
        id: (x: any) => x.date,
        sortDirection: SortDirection.Asc,
      });

      const classes = getSortingClasses({
        id: (x: any) => x.date,
        sortDirection: SortDirection.Asc,
      });

      expect(classes.active);
    });
  });
});
