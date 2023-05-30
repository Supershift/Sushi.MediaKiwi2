export enum TableIconPosition {
  Append,
  Prepend,
}

export interface TableCellIcon {
  position: TableIconPosition;
  iconName: string;
  label?: string;
  tooltip?: string;
}
