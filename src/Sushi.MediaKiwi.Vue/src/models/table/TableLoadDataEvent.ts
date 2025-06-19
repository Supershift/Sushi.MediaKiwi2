export type TableLoadDataEvent = {
  /** Indicates the reason why onLoad is fired */
  type: TableLoadDataEventType;
};

export enum TableLoadDataEventType {
  /** The table is loaded for the first time */
  InitialLoad = "InitialLoad",
  /** The user has changed the page */
  PagingChanged = "PagingChange",
  /** The user has changed the filter */
  FilterChange = "FilterChange",
  /** The user has changed the sort order */
  SortChange = "SortChange"
}
