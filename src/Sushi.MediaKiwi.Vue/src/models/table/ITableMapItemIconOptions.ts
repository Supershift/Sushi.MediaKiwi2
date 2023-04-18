import type { IconPosition } from "../enum/IconPosition";

export interface ITableMapItemIconOptions {
  /** This function will be called for each bound entity and the return value will be displayed. Expects an icon name. E.g. mdi-flag */
  value: string;
  /** This function will be called for each bound entity and the return value will be displayed. Tooltip for the icon hover */
  tooltip?: string | undefined;
  /** Position of the icon relative to the ITableMapItem.value */
  position?: IconPosition;
}
