import { SortDirection, Sorting } from "@/models";
import { SampleData } from "../models/SampleData";

export function sortSampleData(items: SampleData[], sortOrder: Sorting): SampleData[] {
  const sorted = [...items];

  switch (sortOrder.sortBy) {
    case "countryName":
      sorted.sort((a, b) => a.countryName.localeCompare(b.countryName));
      break;
    case "id":
      sorted.sort((a, b) => a.id - b.id);
      break;
    // Add more fields as needed
    default:
      break;
  }

  if (sortOrder.sortDirection === SortDirection.Desc) {
    sorted.reverse();
  }

  return sorted;
}
