export interface Section {
  id: number;
  name: string;
  sortOrder: number;
  icon?: string;
  /** If not empty, access to this screen is restricted to these roles. */
  roles?: string[];
  /** Sets the section in a disabled state */
  disabled?: boolean;
  /** Tooltip text */
  tooltip?: string;
}
