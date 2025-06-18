
export enum TablePagingMode {
  /** Paging is controlled by the client. LoadData will be called for each paging event.  */
  Manual = "Manual",
  /** Paging is performed automatically by the MkTable component. LoadData is not fired for paging events.*/
  Auto = "Auto"
}
