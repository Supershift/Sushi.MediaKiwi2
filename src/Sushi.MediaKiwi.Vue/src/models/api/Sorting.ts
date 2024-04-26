import { SortDirection } from "../enum/SortDirection";

export interface Sorting<T = never> {
  sortBy: keyof T;
  sortDirection: SortDirection;
}
