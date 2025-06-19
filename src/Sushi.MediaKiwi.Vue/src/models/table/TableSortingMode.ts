
export enum TableSortingMode {
  /** Sorting is controlled by the client. LoadData will be called for each sorting event. */
  Manual = "Manual",
  /** Sorting is performed automatically by the MkTable component. LoadData is not fired for sorting events.*/
  Auto = "Auto"
}
