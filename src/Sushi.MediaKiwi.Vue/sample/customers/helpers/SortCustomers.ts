import { SortDirection, Sorting } from "@/models";
import { Customer } from "../models/Customer";

export function SortCustomers(items: Customer[], sortOrder: Sorting): Customer[] {
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
