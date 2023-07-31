export enum TableIconPosition {
  Append,
  Prepend,
}

export interface TableCellIcon {
  /** Defines the position of the icon relative to the label */
  position: TableIconPosition;
  /** Sets the icon to display based on mdi icon names */
  iconName: string;
  /** Text value to display in the cell */
  label?: string;
  /** Tooltip to display when hovering over the icon */
  tooltip?: string;
  /** Color of the icon */
  color?: string;
}
