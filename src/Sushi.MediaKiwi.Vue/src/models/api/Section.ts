export interface Section {
  id: number;
  name: string;
  sortOrder: number;
  icon?: string;
  /** If not empty, access to this screen is restricted to these roles. */
  roles?: string[];
}
